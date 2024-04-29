const { sequelize, DataTypes } = require('../utils/db.util');
const Course = require('./course.model');
const Grade = require('./grade.model');
const User = require('./user.model');
const Year = require('./year.model');

const TeacherClass = sequelize.define('student_class', {
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
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

TeacherClass.belongsTo(Grade, { foreignKey: 'gradeId' });
Grade.hasMany(TeacherClass, { foreignKey: 'gradeId' });

TeacherClass.belongsTo(User, { foreignKey: 'teacherId' });
User.hasMany(TeacherClass, { foreignKey: 'teacherId' });

TeacherClass.belongsTo(Year, { foreignKey: 'yearId' });
Year.hasMany(TeacherClass, { foreignKey: 'yearId' });

TeacherClass.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(TeacherClass, { foreignKey: 'courseId' });

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

TeacherClass.sync();

module.exports = TeacherClass;
