const { sequelize, DataTypes } = require('../utils/db.util');
const Class = require('./class.model');
const Course = require('./course.model');
const Grade = require('./grade.model');
const User = require('./user.model');
const Year = require('./year.model');

const TeacherClass = sequelize.define('teacher_class', {
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

TeacherClass.belongsTo(Class, { foreignKey: 'gradeId' });
Class.hasMany(TeacherClass, { foreignKey: 'gradeId' });

TeacherClass.belongsTo(User, { foreignKey: 'teacherId' });
User.hasMany(TeacherClass, { foreignKey: 'teacherId' });

TeacherClass.belongsTo(Class, { foreignKey: 'yearId' });
Class.hasMany(TeacherClass, { foreignKey: 'yearId' });

TeacherClass.belongsTo(Class, { foreignKey: 'classOrder' });
Class.hasMany(TeacherClass, { foreignKey: 'classOrder' });

TeacherClass.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(TeacherClass, { foreignKey: 'courseId' });

TeacherClass.sync({});

module.exports = TeacherClass;
