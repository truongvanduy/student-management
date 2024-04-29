const Grade = require('../models/grade.model');

module.exports = {
  index: async (req, res, next) => {
    const { q } = req.query;
    const filter = {};
    if (q) {
      filter.where = {
        gradeLevel: {
          [Op.like]: `%${q}%`,
        },
      };
    }
    try {
      const grades = await Grade.findAll(filter);
      return res.send(grades);
    } catch (error) {}
  },
};
