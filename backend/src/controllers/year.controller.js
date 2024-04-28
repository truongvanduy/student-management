const ApiError = require('../api-error');
const Score = require('../models/score.model');
const Year = require('../models/year.model');

module.exports = {
  async show(req, res, next) {
    try {
      const years = await Year.findAll({});
      if (!years) {
        return next(new ApiError(404, 'Không tìm thấy năm học'));
      }
      return res.send(years);
    } catch (error) {}
  },
  async getStudentYear(req, res, next) {
    const student = req?.student;
    if (!student) {
      return next(new ApiError(404, 'Unauthorized'));
    }

    try {
      const scoreYears = await Score.findAll({
        attributes: ['yearId'],
        group: ['yearId'],
        where: {
          userId: student.id,
        },
        include: Year,
      });
      const yearArray = scoreYears.map((year) => year.yearId);
      if (yearArray.length === 0) {
        return next(new ApiError(404, 'Chưa có dữ liệu điểm'));
      }

      return res.send(scoreYears.map((year) => year.Year));
    } catch (error) {
      return next(
        new ApiError(
          500,
          'Có lỗi xảy ra khi lấy dữ liệu năm học của sinh: ' + error.message
        )
      );
    }
  },
};
