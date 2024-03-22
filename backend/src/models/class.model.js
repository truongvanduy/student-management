const { sequelize, DataTypes } = require('../utils/db.util');
const Grade = require('./grade.model');
const Year = require('./year.model');

const Class = sequelize.define('class', {
  order: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  gradeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  yearId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
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
});

Year.hasMany(Class, { foreignKey: 'yearId' });
Class.belongsTo(Year, { foreignKey: 'yearId' });

Grade.hasMany(Class, { foreignKey: 'gradeId' });
Class.belongsTo(Grade, { foreignKey: 'gradeId' });

Class.sync();

module.exports = Class;
