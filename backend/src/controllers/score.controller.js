const ApiError = require('../api-error');
const Course = require('../models/course.model');
const Score = require('../models/score.model');
const Year = require('../models/year.model');

module.exports = {
  async show(req, res, next) {
    try {
      // Retrieve student info from checkStudent middleware
      const student = req?.student;
      if (!student) {
        return next(new ApiError(404, 'Unauthorized'));
      }

      const { semester } = req?.query;

      // Retrieve student's scores
      const scores = await Score.findAll({
        where: {
          studentId: student.id,
          yearId: 2,
          semesterId: semester === '1' ? 1 : [1, 2],
        },
        include: [Year],
      });
      // }
      res.send(scores);
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while retrieving student info: ${error.message}`
        )
      );
    }
  },
};
