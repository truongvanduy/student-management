const { where, Op } = require('sequelize');
const ApiError = require('../api-error');
const User = require('../models/user.model');
const teacherClass = require('../models/teacher_class.model');
const Grade = require('../models/grade.model');
const Year = require('../models/year.model');
const config = require('../configs');
const Class = require('../models/class.model');
const Parent = require('../models/parent.model');
const hash_passwordUtil = require('../utils/hash_password.util');

module.exports = {
  async index(req, res, next) {
    const { name, yearId } = req.query;
    let filter = {
      role: 'teacher',
    };
    let yearFilter = {};
    if (name) {
      filter = {
        ...filter,
        [Op.or]: [
          {
            firstName: {
              [Op.substring]: name,
            },
          },
          {
            lastName: {
              [Op.substring]: name,
            },
          },
        ],
      };
    }
    if (yearId) {
      yearFilter = {
        yearId: parseInt(yearId),
      };
    }
    console.log('here');
    try {
      const teachers = await User.findAll({
        where: filter,
        // include: {
        // model: teacherClass,
        // required: true,
        // where: yearFilter,
        // },
      });
      return res.send(teachers);
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm sinh viên, ' + error)
      );
    }
  },
  create: async (req, res, next) => {
    try {
      const years = await Year.findAll({
        limit: config?.logic?.numOfExistingYears || 3,
        order: [['id', 'DESC']],
      });
      const grades = await Grade.findAll();
      const classes = await Class.findAll({
        where: {
          yearId: {
            [Op.in]: years.map((year) => year.id),
          },
          gradeId: {
            [Op.in]: grades.map((grade) => grade.id),
          },
        },
      });

      return res.send({ grades, years, classes });
    } catch (error) {
      return next(new ApiError(500, 'Có lỗi xảy ra: ' + error));
    }
  },

  store: async (req, res, next) => {
    const {
      firstName,
      lastName,
      sex,
      dateOfBirth,
      placeOfBirth,
      address,
      phoneNumber,
      class: teacherClass,
      parents,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !sex ||
      !dateOfBirth ||
      !placeOfBirth ||
      !address ||
      !phoneNumber
    ) {
      return next(new ApiError(400, 'Vui lòng điền đầy đủ thông tin'));
    }

    try {
      // Create teacher
      const teacher = await User.create({
        firstName,
        lastName,
        sex,
        dateOfBirth,
        placeOfBirth,
        address,
        phoneNumber,
        role: 'teacher',
        password: phoneNumber,
      });
      // Assign class
      if (
        !teacherClass.yearId ||
        !teacherClass.classOrder ||
        !teacherClass.gradeId
      ) {
        return next(new ApiError(400, 'Vui lòng chọn lớp học hợp lệ'));
      }

      // Find existing class in this year
      const assignedClass = await teacherClass.findOne({
        where: {
          teacherId: teacher.id,
          yearId: teacherClass.yearId,
        },
      });
      if (assignedClass === null) {
        await teacherClass.create({
          ...teacherClass,
          teacherId: teacher.id,
        });
      } else {
        await assignedClass.update(
          {
            ...teacherClass,
            teacherId: teacher.id,
          },
          {
            where: {
              teacherId: teacher.id,
              yearId: teacherClass.yearId,
            },
          }
        );
      }

      parents.forEach(async (parent) => {
        if (
          !parent.fullName ||
          !parent.phoneNumber ||
          !parent.occupation ||
          !parent.relation
        ) {
          return;
        }
        await Parent.create({
          teacherId: teacher.id,
          ...parent,
        });
      });

      return next();
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tạo sinh viên, ' + error)
      );
    }
  },
  edit: async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new ApiError(400, 'Mã học sinh không hợp lệ'));
    }
    try {
      // General info
      const years = await Year.findAll({
        limit: config?.logic?.numOfExistingYears || 3,
        order: [['id', 'DESC']],
      });
      const grades = await Grade.findAll();
      const classes = await Class.findAll({
        where: {
          yearId: {
            [Op.in]: years.map((year) => year.id),
          },
          gradeId: {
            [Op.in]: grades.map((grade) => grade.id),
          },
        },
      });

      // teacher info
      const teacher = await User.findOne({
        where: {
          id: parseInt(id),
          role: 'teacher',
        },
      });
      if (!teacher) {
        return next(new ApiError(404, 'Không tìm thấy học sinh'));
      }
      const teacherClass = await teacherClass.findOne({
        where: {
          teacherId: teacher.id,
        },
      });

      const parents = await Parent.findAll({
        where: {
          teacherId: teacher.id,
        },
      });

      return res.send({
        grades,
        years,
        classes,
        teacher,
        parents,
        teacherClass,
      });
    } catch (error) {
      return next(new ApiError(500, 'Có lỗi xảy ra: ' + error));
    }
  },

  update: async (req, res, next) => {
    let { id } = req.params;
    if (!id) return next(new ApiError(400, 'Mã học sinh không hợp lệ'));
    id = parseInt(id);
    const {
      firstName,
      lastName,
      sex,
      dateOfBirth,
      placeOfBirth,
      address,
      phoneNumber,
      class: teacherClass,
      parents,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !sex ||
      !dateOfBirth ||
      !placeOfBirth ||
      !address ||
      !phoneNumber
    ) {
      return next(new ApiError(400, 'Vui lòng điền đầy đủ thông tin'));
    }

    try {
      // Update teacher

      const teacher = await User.findOne({
        where: {
          id: parseInt(id),
        },
      });
      if (!teacher) {
        return next(new ApiError(404, 'Không tìm thấy học sinh'));
      }

      await User.update(
        {
          firstName,
          lastName,
          sex,
          dateOfBirth,
          placeOfBirth,
          address,
          phoneNumber,
          role: 'teacher',
          password: phoneNumber,
        },
        {
          where: {
            id,
          },
        }
      );

      // Assign class
      if (
        !teacherClass.yearId ||
        !teacherClass.classOrder ||
        !teacherClass.gradeId
      ) {
        return next(new ApiError(400, 'Vui lòng chọn lớp học hợp lệ'));
      }

      // Find existing class in this year
      const assignedClass = await teacherClass.findOne({
        where: {
          teacherId: teacher.id,
          yearId: teacherClass.yearId,
        },
      });

      if (assignedClass === null) {
        return next(new ApiError(404, 'Không tìm thấy lớp học của học sinh'));
      } else {
        await assignedClass.update(
          {
            ...teacherClass,
          },
          {
            where: {
              teacherId: teacher.id,
              yearId: teacherClass.yearId,
            },
          }
        );
      }

      parents.forEach(async (parent) => {
        if (
          !parent.fullName ||
          !parent.phoneNumber ||
          !parent.occupation ||
          !parent.relation
        ) {
          return;
        }
        await Parent.upsert(
          {
            ...parent,
            teacherId: teacher.id,
          },
          {
            where: {
              teacherId: teacher.id,
              relation: parent.relation,
            },
          }
        );
      });

      return next();
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi cập nhật sinh viên, ' + error)
      );
    }
  },
  destroy: async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new ApiError(400, 'Mã học sinh không hợp lệ'));
    try {
      await User.destroy({
        where: {
          id: parseInt(id),
        },
      });
      return next();
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi xóa sinh viên, ' + error)
      );
    }
  },
};
