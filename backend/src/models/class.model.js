const { sequelize, DataTypes } = require('../utils/db.util');

const Class = sequelize.define(
  'class',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfStudents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 50,
      },
    },
  },
  {
    primaryKey: {
      fields: ['gradeId', 'yearId'],
    },
  }
);

module.exports = Class;
