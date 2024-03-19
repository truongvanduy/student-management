const { sequelize, DataTypes } = require('../utils/db.util');

const Course = sequelize.define('course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Course;
