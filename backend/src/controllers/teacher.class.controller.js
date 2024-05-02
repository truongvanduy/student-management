const { where, col, Sequelize, Op } = require('sequelize');

const TeacherClass = require('../models/teacher_class.model');
const Grade = require('../models/grade.model');
const Course = require('../models/course.model');
const Class = require('../models/class.model');
const Homeroom = require('../models/homeroom.model');
const ApiError = require('../api-error');
const { sequelize } = require('../utils/db.util');
const User = require('../models/user.model');
const StudentClass = require('../models/student_class.model');
const Score = require('../models/score.model');
const scoreService = require('../services/score.service');

module.exports = {
  index: async (req, res, next) => {
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
            ],
          },
          {
            model: Course,
            required: true,
          },
        ],
      });
      return res.send(classes);
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm lớp học: ' + error)
      );
    }
  },
  async edit(req, res, next) {
    try {
      const { yearId, semesterId, gradeId, classOrder, courseId } = req.query;

      // Get student ids in the class
      const studentIds = await StudentClass.findAll({
        attributes: ['studentId'],
        where: {
          yearId: yearId,
          gradeId: gradeId,
          classOrder: classOrder,
        },
        include: {
          model: User,
          required: true,
          attributes: ['firstName', 'lastName'],
        },
        order: [[User, 'firstName', 'ASC']],
        raw: true,
      });

      const students = studentIds.map((student) => ({
        id: student.studentId,
        firstName: student['user.firstName'],
        lastName: student['user.lastName'],
      }));

      const scores = await Score.findAll({
        where: {
          studentId: {
            [Op.in]: studentIds.map((student) => student.studentId),
          },
          yearId: yearId,
          semesterId: semesterId,
          courseId: courseId,
        },
      });

      // Create a map of studentId to index in the array
      const indexOf = new Map();
      studentIds.forEach((student, index) => {
        indexOf.set(student.studentId, index);
      });
      // Get group scores by student
      const groupScores = scoreService.groupScoreByStudent(scores, indexOf);

      // Calculate average scores
      const avgScores = scoreService.calcAvgScores(groupScores);

      const response = { students, groupScores, avgScores };
      if (semesterId == 2) {
        const scores = await Score.findAll({
          where: {
            studentId: {
              [Op.in]: studentIds.map((student) => student.studentId),
            },
            yearId: yearId,
            semesterId: 1,
            courseId: courseId,
          },
        });

        // Get group scores by student
        const groupScores = scoreService.groupScoreByStudent(scores, indexOf);

        // Calculate average scores
        const firstSemesterAvgScores = scoreService.calcAvgScores(groupScores);
        const overallAvgScores = scoreService.calcClassOverallAvgScores(
          firstSemesterAvgScores,
          avgScores
        );
        response.overallAvgScores = overallAvgScores;
      }

      res.send(response);
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while retrieving student scores: ${error}`
        )
      );
    }
  },

  update: async (req, res, next) => {
    const { scores } = req.body;
    try {
      await sequelize.transaction(async (t) => {
        await Promise.all(
          scores.map(async (score) => {
            if (!score.content.score) {
              await Score.destroy(
                { where: { id: score.id } },
                { transaction: t }
              );
            } else {
              await Score.upsert(
                { id: score.id, ...score.content },
                {
                  where: {
                    id: score.id,
                  },
                },
                { transaction: t }
              );
            }
          })
        );
      });
      return res.send('Cập nhật điểm thành công');
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi cập nhật điểm: ' + error)
      );
    }
  },
};
