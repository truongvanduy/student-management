const student = require('../utils/data/student');
const { sequelize, DataTypes } = require('../utils/db.util');
const Class = require('./class.model');
const Grade = require('./grade.model');
const Student = require('./student.model');

const StudentClass = sequelize.define('student_class', {
  gradeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  yearId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  classOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

StudentClass.belongsTo(Grade, { foreignKey: 'gradeId' });

// const queryInterface = sequelize.getQueryInterface();

// StudentClass.sync().then(() => {
//   queryInterface.addConstraint('student_class', {
//     fields: ['grade_id', 'year_id', 'class_order'],
//     type: 'foreign key',
//     references: {
//       table: 'class',
//       fields: ['grade_id', 'year_id', 'order'],
//     },
//   });
//   queryInterface.addConstraint('student_class', {
//     fields: ['student_id'],
//     type: 'foreign key',
//     references: {
//       table: 'student',
//       fields: ['id'],
//     },
//   });
// });

StudentClass.sync();

module.exports = StudentClass;
