const { where } = require('sequelize');
const ApiError = require('../api-error');
const Course = require('../models/course.model');
const Score = require('../models/score.model');
const Year = require('../models/year.model');

async function groupScoreByCourse(semesterScore) {
  const courses = await Course.findAll();
  const groupScores = Array.from({ length: courses.length }, () => ({
    regular: [],
  }));
  semesterScore.forEach((score) => {
    if (score.type === 'regular') {
      groupScores[score.courseId - 1].regular.push(score);
    } else {
      groupScores[score.courseId - 1][score.type] = score;
    }
  });
  return groupScores;
}

function calcAvgScore(groupScores) {
  return groupScores.map((group) => {
    const sumOfRegularScore = group.regular.reduce(
      (acc, cur) => acc + parseFloat(cur.score),
      0
    );
    const numOfRegularScore = group.regular.length;
    const midtermScore = group.midterm.score;
    const finalScore = group.final.score;

    // Regular weight: 1
    // Midterm weight: 2
    // Final weight:   3
    const average = (
      (sumOfRegularScore + midtermScore * 2 + finalScore * 3) /
      (numOfRegularScore + 2 + 3)
    ).toFixed(1);

    return average;
  });
}

module.exports = {
  async show(req, res, next) {
    try {
      // Retrieve student info from checkStudent middleware
      const student = req?.student;
      if (!student) {
        return next(new ApiError(404, 'Unauthorized'));
      }

      const { yearId, semester } = req.query;

      // Find years when student enroll in
      const scoreYears = await Score.findAll({
        attributes: ['yearId'],
        group: ['yearId'],
        where: {
          studentId: student.id,
        },
        distinct: true,
      });
      // Flatten the object to an array of yearId
      const yearArray = scoreYears.map((year) => year.yearId);

      // Validate yearId from query
      if (yearArray.length === 0 || !yearArray.includes(parseInt(yearId))) {
        return next(new ApiError(404, 'Năm học không hợp lệ'));
      }

      // Create filter for querying student's scores
      const filter = {
        yearId: parseInt(yearId),
      };
      if (semester) {
        const intSemester = parseInt(semester);
        if (intSemester === NaN)
          return next(new ApiError(404, 'Học kỳ không hợp lệ'));

        filter.semesterId = parseInt(semester);
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
      let firstSemesterAvg = [];
      let secondSemesterAvg = [];
      let groupScores = [];

      if (semester === '1') {
        groupScores = await groupScoreByCourse(scores);
        firstSemesterAvg = calcAvgScore(groupScores);

        res.send({
          groupScores,
          firstSemesterAvg,
        });
      } else {
        // Calculate average score for the 1st semester
        const firstSemesterScores = scores.filter(
          (score) => score.semesterId === 1
        );
        groupScores = await groupScoreByCourse(firstSemesterScores);
        firstSemesterAvg = calcAvgScore(groupScores);

        // Group scores by course and calculate averaeg score for the 2nd semester
        const secondSemesterScores = scores.filter(
          (score) => score.semesterId === 2
        );
        groupScores = await groupScoreByCourse(secondSemesterScores);
        secondSemesterAvg = calcAvgScore(groupScores);

        // Calculate average score for the whole year
        // (1st semester score + (2 * 2nd semester score)) / 3
        const wholeYearAvg = firstSemesterAvg.map((score, index) =>
          (
            (parseFloat(score) + 2 * parseFloat(secondSemesterAvg[index])) /
            3
          ).toFixed(1)
        );

        res.send({
          firstSemesterAvg,
          groupScores,
          secondSemesterAvg,
          wholeYearAvg,
        });
      }
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while retrieving student info: ${error}`
        )
      );
    }
  },
};
