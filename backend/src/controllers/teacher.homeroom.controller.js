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
const { get } = require('../routes/api/homeroom.route');
const Conduct = require('../models/conduct.model');

module.exports = {
  index: async (req, res, next) => {
    const teacherId = req?.teacher?.id;
    try {
      const { yearId } = req.query;
      let filter = {
        teacherId,
      };
      if (yearId) {
        filter.yearId = parseInt(yearId);
      }

      // Get teacher's class info
      const homeroomClass = await Homeroom.findOne({
        where: {
          teacherId: teacherId,
          yearId: yearId,
        },
        include: [
          {
            model: Class,
            required: true,
            where: {
              yearId: where(col('homeroom.year_id'), '=', col('class.year_id')),
              gradeId: where(
                col('homeroom.grade_id'),
                '=',
                col('class.grade_id')
              ),
              order: where(
                col('homeroom.class_order'),
                '=',
                col('class.order')
              ),
            },
            include: {
              model: Grade,
              required: true,
            },
          },
        ],
      });

      return res.send({ homeroomClass });
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm lớp học: ' + error)
      );
    }
  },

  getResultStatistics: async (req, res, next) => {
    const teacherId = req?.teacher?.id;
    try {
      const { yearId } = req.query;
      let filter = {
        teacherId,
      };
      if (yearId) {
        filter = { ...filter, yearId: yearId };
      }

      // Get teacher's class info
      const homeroomClass = await Homeroom.findOne({
        where: {
          teacherId: teacherId,
          yearId: yearId,
        },
        include: [
          {
            model: Class,
            required: true,
            where: {
              yearId: where(col('homeroom.year_id'), '=', col('class.year_id')),
              gradeId: where(
                col('homeroom.grade_id'),
                '=',
                col('class.grade_id')
              ),
              order: where(
                col('homeroom.class_order'),
                '=',
                col('class.order')
              ),
            },
            include: {
              model: Grade,
              required: true,
            },
          },
        ],
      });

      // Get student class results
      const studentIds = await StudentClass.findAll({
        where: {
          yearId: parseInt(yearId),
          gradeId: homeroomClass.class.gradeId,
          classOrder: homeroomClass.classOrder,
        },
        attributes: ['studentId'],
        raw: true,
      });

      const first = await Promise.all(
        studentIds.map(async (studentId) => {
          return await scoreService.getStudentResult(
            studentId.studentId,
            parseInt(yearId),
            1
          );
        })
      );
      const second = await Promise.all(
        studentIds.map(async (studentId) => {
          return await scoreService.getStudentResult(
            studentId.studentId,
            parseInt(yearId),
            2
          );
        })
      );
      const overallScores = first.map((firstEl, index) => {
        return scoreService.calcOverallAvgScores(
          firstEl.semesterAvgScores,
          second[index].semesterAvgScores
        );
      });

      const overall = overallScores.map((overallScore) => {
        return scoreService.avgScoresToStudentResult(overallScore);
      });
      const results = [first, second, overall];

      return res.send(results);
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm lớp học: ' + error)
      );
    }
  },

  getStudents: async (req, res, next) => {
    const teacherId = req?.teacher?.id;
    const { yearId } = req.query;
    let filter = {
      teacherId,
    };
    if (yearId) {
      filter.yearId = yearId;
    }
    try {
      // Get teacher's class info
      const homeroom = await Homeroom.findOne({
        where: {
          teacherId: teacherId,
          yearId: yearId,
        },
      });

      const studentClasses = await StudentClass.findAll({
        where: {
          yearId: homeroom.yearId,
          gradeId: homeroom.gradeId,
          classOrder: homeroom.classOrder,
        },
        include: {
          model: User,
          required: true,
          where: {
            role: 'student',
          },
        },
        order: [[User, 'firstName', 'ASC']],
      });
      const students = studentClasses.map((studentClass) => studentClass.user);

      res.send(students);
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm học sinh: ' + error)
      );
    }
  },

  getStudentScores: async (req, res, next) => {
    // Retrieve student info from checkStudent middleware
    const studentId = req.params?.id;
    if (!studentId) {
      return next(new ApiError(404, 'Không tìm thấy học sinh'));
    }

    const { yearId, semesterId } = req.query;

    // Create filter for querying student's scores
    const filter = {
      yearId: parseInt(yearId),
    };
    if (semesterId) {
      const intSemesterId = parseInt(semesterId);
      if (intSemesterId === NaN)
        return next(new ApiError(404, 'Học kỳ không hợp lệ'));

      filter.semesterId = intSemesterId;
    }
    try {
      const student = await User.findOne({
        where: {
          id: studentId,
          role: 'student',
        },
      });
      if (!student) {
        return next(new ApiError(404, 'Không tìm thấy học sinh'));
      }

      // Retrieve student's scores
      const scores = await Score.findAll({
        where: {
          studentId,
          ...filter,
        },
      });

      if (scores.length === 0) {
        return next(new ApiError(404, 'No score found'));
      }

      // Process student's scores
      let firstSemesterAvgs = [];
      let secondSemesterAvgs = [];
      let groupScores = [];

      if (semesterId === '1') {
        groupScores = await scoreService.groupScoreByCourse(scores);
        firstSemesterAvgs = scoreService.calcAvgScores(groupScores);
        const firstSemesterAvg =
          scoreService.calcSemseterAvg(firstSemesterAvgs);
        const firstSemesterTitle = scoreService.getTitle(firstSemesterAvgs);

        res.send({
          student,
          groupScores,
          firstSemesterAvgs,
          firstSemesterAvg,
          firstSemesterTitle,
        });
      } else {
        // Calculate average score for the 1st semester
        const firstSemesterScores = scores.filter(
          (score) => score.semesterId === 1
        );
        groupScores = await scoreService.groupScoreByCourse(
          firstSemesterScores
        );
        firstSemesterAvgs = scoreService.calcAvgScores(groupScores);
        const firstSemesterAvg =
          scoreService.calcSemseterAvg(firstSemesterAvgs);
        const firstSemesterTitle = scoreService.getTitle(firstSemesterAvgs);

        // Group scores by course and calculate averaeg score for the 2nd semester
        const secondSemesterScores = scores.filter(
          (score) => score.semesterId === 2
        );
        groupScores = await scoreService.groupScoreByCourse(
          secondSemesterScores
        );
        secondSemesterAvgs = scoreService.calcAvgScores(groupScores);
        const secondSemesterAvg =
          scoreService.calcSemseterAvg(secondSemesterAvgs);
        const secondSemesterTitle = scoreService.getTitle(secondSemesterAvgs);

        // Calculate average score for the whole year
        // (1st semester score + (2 * 2nd semester score)) / 3
        const overallAvgs = scoreService.calcOverallAvgScores(
          firstSemesterAvgs,
          secondSemesterAvgs
        );
        const overallAvg = scoreService.calcFinalAvg(
          firstSemesterAvg,
          secondSemesterAvg
        );
        const overallTitle = scoreService.getTitle(overallAvgs);

        res.send({
          student,
          firstSemesterAvg,
          firstSemesterAvgs,
          firstSemesterTitle,
          groupScores,
          secondSemesterAvg,
          secondSemesterAvgs,
          secondSemesterTitle,
          overallAvg,
          overallAvgs,
          overallTitle,
        });
      }
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while retrieving student scores: ${error}`
        )
      );
    }
  },

  getConducts: async (req, res, next) => {
    const teacherId = req?.teacher?.id;
    const { yearId, semesterId } = req.query;
    let filter = {
      teacherId,
    };
    if (yearId) {
      filter.yearId = yearId;
    }
    try {
      // Get teacher's class info
      const homeroom = await Homeroom.findOne({
        where: {
          teacherId: teacherId,
          yearId: yearId,
        },
      });

      const studentClasses = await StudentClass.findAll({
        where: {
          yearId: homeroom.yearId,
          gradeId: homeroom.gradeId,
          classOrder: homeroom.classOrder,
        },
        include: {
          model: User,
          required: true,
          where: {
            role: 'student',
          },
          include: {
            model: Conduct,
            required: false,
            where: {
              semesterId: parseInt(semesterId),
            },
          },
        },
        order: [[User, 'firstName', 'ASC']],
      });
      const students = studentClasses.map((studentClass) => studentClass.user);

      res.send(students);
    } catch (error) {
      return next(
        new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm học sinh: ' + error)
      );
    }
  },
};
