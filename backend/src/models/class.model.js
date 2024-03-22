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

// const queryInterface = sequelize.getQueryInterface();

// queryInterface.addConstraint('class', {
//   fields: ['grade_id', 'year_id', 'order'],
//   type: 'unique',
//   name: 'class_grade_id_year_id_order_unique',
// });

// Class.sync({ alter: true });

module.exports = Class;
