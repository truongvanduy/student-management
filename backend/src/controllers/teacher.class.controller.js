const { where, col, Sequelize, Op } = require('sequelize');

const TeacherClass = require('../models/teacher_class.model');
const Grade = require('../models/grade.model');
const Course = require('../models/course.model');
const Class = require('../models/class.model');
const Homeroom = require('../models/homeroom.model');
const ApiError = require('../api-error');
const { sequelize } = require('../utils/db.util');
const User = require('../models/user.model');

module.exports = {
  index: async (req, res, next) => {
    console.log('there');
    const teacherId = req?.teacher?.id;
    try {
      const { yearId } = req.query;
      let filter = {
        teacherId,
      };
      if (yearId) {
        filter = { ...filter, yearId: yearId };
      }

      const classes = await TeacherClass.findAll({
        where: {
          teacher_id: teacherId,
          year_id: yearId,
        },
        include: [
          {
            model: Class,
            required: true,
            where: {
              order: where(
                col('teacher_class.class_order'),
                '=',
                col('class.order')
              ),
              gradeId: where(
                col('teacher_class.grade_id'),
                '=',
                col('class.grade_id')
              ),
              yearId: where(
                col('teacher_class.year_id'),
                '=',
                col('class.year_id')
              ),
            },
            include: [
              {
                model: Grade,
                required: true,
              },
              {
                model: Homeroom,
                include: {
                  model: User,
                  required: true,
                },
              },
            ],
          },
          {
            model: Course,
            required: true,
          },
        ],
      });
      console.log(classes.dataValue);
      return res.send(classes);
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm lớp học: ' + error)
      );
    }
  },
};
