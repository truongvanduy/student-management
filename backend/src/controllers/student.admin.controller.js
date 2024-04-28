const { where, Op } = require('sequelize');
const ApiError = require('../api-error');
const User = require('../models/user.model');
const StudentClass = require('../models/student_class.model');
const Grade = require('../models/grade.model');
const Year = require('../models/year.model');
const config = require('../configs');
const Class = require('../models/class.model');

module.exports = {
  async index(req, res, next) {
    try {
      const students = await User.findAll({
        where: {
          role: 'student',
        },
        include: {
          model: StudentClass,
          include: Grade,
        },
      });

      // if (!students) {
      //   return next(new ApiError(404, 'Có lỗi xảy ra khi truy xuất sinh viên'));
      // }

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
    } catch (error) {}
  },

  store: async (req, res, next) => {
    const { firstName, lastName, dateOfBirth, address, phoneNumber } = req.body;
    if (!firstName || !lastName || !dateOfBirth || !address || !phoneNumber) {
      return next(new ApiError(400, 'Vui lòng điền đầy đủ thông tin'));
    }

    try {
      const student = await User.create({
        firstName,
        lastName,
        dateOfBirth,
        address,
        phoneNumber,
        role: 'student',
      });
      return next();
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tạo sinh viên, ' + error)
      );
    }
  },
  edit: async (req, res, next) => {},
  update: async (req, res, next) => {},
  destroy: async (req, res, next) => {},
};
