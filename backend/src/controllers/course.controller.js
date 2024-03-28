const Course = require('../models/course.model');

module.exports = {
  async show(req, res, next) {
    try {
      const courses = await Course.findAll();
      res.send(courses);
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while retrieving course info: ${error.message}`
        )
      );
    }
  },
};
