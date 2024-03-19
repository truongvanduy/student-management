const { sequelize, DataTypes } = require('../utils/db.util');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  gradeLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[9, 10, 11, 12]],
    },
  },
});

module.exports = Grade;
