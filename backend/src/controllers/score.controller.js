const { where, Op } = require('sequelize');
const ApiError = require('../api-error');
const Course = require('../models/course.model');
const Score = require('../models/score.model');
const Year = require('../models/year.model');
const scoreService = require('../services/score.service');
const { sequelize } = require('../utils/db.util');
const StudentClass = require('../models/student_class.model');
const Class = require('../models/class.model');
const Grade = require('../models/grade.model');

module.exports = {
  async show(req, res, next) {
    try {
      // Retrieve student info from checkStudent middleware
      const student = req?.student;
      if (!student) {
        return next(new ApiError(404, 'Unauthorized'));
      }

      const { yearId, semesterId } = req.query;

      // Find years when student enroll in
      const scoreYears = await Score.findAll({
        attributes: ['yearId'],
        group: ['yearId'],
        where: {
          studentId: student.id,
        },
        distinct: true,
        raw: true,
      });
      // Flatten the object to an array of yearId
      const yearArray = scoreYears.map((year) => year.yearId);

      // Validate yearId from query
      if (yearArray.length === 0 || !yearArray.includes(parseInt(yearId))) {
        return next(new ApiError(404, 'Năm học không hợp lệ'));
      }

      const studentClass = await StudentClass.findOne({
        where: {
          yearId: parseInt(yearId),
          studentId: student.id,
        },
        include: [
          {
            model: Class,
            required: true,
            include: [
              {
                model: Grade,
                required: true,
              },
            ],
          },
        ],
      });
      const _class = studentClass?.class;

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

      // Retrieve student's scores
      const scores = await Score.findAll({
        where: {
          studentId: student.id,
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
          _class,
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
          _class,
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

  async edit(req, res, next) {
    try {
      const { yearId, semesterId, gradeId, classOrder, courseId } = req.query;

      // Get number of students in the selected class
      const selectedClass = await Class.findOne({
        where: {
          yearId: yearId,
          gradeId: gradeId,
          order: classOrder,
        },
        attributes: ['studentCount'],
      });

      const studentIds = await StudentClass.findAll({
        attributes: ['studentId'],
        where: {
          yearId: yearId,
          gradeId: gradeId,
          classOrder: classOrder,
        },
        raw: true,
      });

      const scores = await Score.findAll({
        where: {
          studentId: {
            [Op.in]: studentIds.map((student) => student.studentId),
          },
          yearId: yearId,
          semesterId: semesterId,
          courseId: courseId,
        },
        include: [
          {
            model: Course,
            required: true,
          },
        ],
      });

      res.send(
        scoreService.groupScoreByStudent(scores, selectedClass.studentCount)
      );
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while retrieving student scores: ${error}`
        )
      );
    }
  },
  async update(req, res, next) {},
};
