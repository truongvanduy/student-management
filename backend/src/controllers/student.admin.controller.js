const { where, Op } = require('sequelize');
const ApiError = require('../api-error');
const User = require('../models/user.model');
const StudentClass = require('../models/student_class.model');
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
      role: 'student',
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
    try {
      const students = await User.findAll({
        where: filter,
        include: {
          model: StudentClass,
          required: true,
          where: yearFilter,
          include: Grade,
        },
      });

      return res.send(students);
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
      dateOfBirth,
      placeOfBirth,
      address,
      phoneNumber,
      class: studentClass,
      parents,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !placeOfBirth ||
      !address ||
      !phoneNumber
    ) {
      return next(new ApiError(400, 'Vui lòng điền đầy đủ thông tin'));
    }

    try {
      // Create student
      const student = await User.create({
        firstName,
        lastName,
        dateOfBirth,
        placeOfBirth,
        address,
        phoneNumber,
        role: 'student',
        password: phoneNumber,
      });
      // Assign class
      if (
        !studentClass.yearId ||
        !studentClass.classOrder ||
        !studentClass.gradeId
      ) {
        return next(new ApiError(400, 'Vui lòng chọn lớp học hợp lệ'));
      }

      // Find existing class in this year
      const assignedClass = await StudentClass.findOne({
        where: {
          studentId: student.id,
          yearId: studentClass.yearId,
        },
      });
      if (assignedClass === null) {
        await StudentClass.create({
          ...studentClass,
          studentId: student.id,
        });
      } else {
        await assignedClass.update(
          {
            ...studentClass,
            studentId: student.id,
          },
          {
            where: {
              studentId: student.id,
              yearId: studentClass.yearId,
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
          studentId: student.id,
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

      // Student info
      const student = await User.findOne({
        where: {
          id: parseInt(id),
          role: 'student',
        },
      });
      if (!student) {
        return next(new ApiError(404, 'Không tìm thấy học sinh'));
      }
      const studentClass = await StudentClass.findOne({
        where: {
          studentId: student.id,
        },
      });

      const parents = await Parent.findAll({
        where: {
          studentId: student.id,
        },
      });

      return res.send({
        grades,
        years,
        classes,
        student,
        parents,
        studentClass,
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
      dateOfBirth,
      placeOfBirth,
      address,
      phoneNumber,
      class: studentClass,
      parents,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !placeOfBirth ||
      !address ||
      !phoneNumber
    ) {
      return next(new ApiError(400, 'Vui lòng điền đầy đủ thông tin'));
    }

    try {
      // Update student

      const student = await User.findOne({
        where: {
          id: parseInt(id),
        },
      });
      if (!student) {
        return next(new ApiError(404, 'Không tìm thấy học sinh'));
      }

      await User.update(
        {
          firstName,
          lastName,
          dateOfBirth,
          placeOfBirth,
          address,
          phoneNumber,
          role: 'student',
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
        !studentClass.yearId ||
        !studentClass.classOrder ||
        !studentClass.gradeId
      ) {
        return next(new ApiError(400, 'Vui lòng chọn lớp học hợp lệ'));
      }

      // Find existing class in this year
      const assignedClass = await StudentClass.findOne({
        where: {
          studentId: student.id,
          yearId: studentClass.yearId,
        },
      });

      if (assignedClass === null) {
        return next(new ApiError(404, 'Không tìm thấy lớp học của học sinh'));
      } else {
        await assignedClass.update(
          {
            ...studentClass,
          },
          {
            where: {
              studentId: student.id,
              yearId: studentClass.yearId,
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
          return next(new ApiError(400, 'Vui lòng điền đầy đủ thông tin'));
        }
        await Parent.upsert(
          {
            ...parent,
            studentId: student.id,
          },
          {
            where: {
              studentId: student.id,
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
