const student = require('../utils/data/student');
const { sequelize, DataTypes } = require('../utils/db.util');
const Class = require('./class.model');
const Student = require('./student.model');

const StudentClass = sequelize.define('student_class', {
  // gradeId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   primaryKey: true,
  // },
  // yearId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   primaryKey: true,
  // },
  // classOrder: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   primaryKey: true,
  // },
  // studentId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   primaryKey: true,
  // },
});

Class.belongsToMany(Student, {
  foreignKey: 'classOrder',
  through: StudentClass,
});
Student.belongsToMany(Class, {
  foreignKey: 'studentId',
  through: StudentClass,
});
StudentClass.belongsTo(Class, { foreignKey: 'yearId', constraints: true });
Class.hasMany(StudentClass, { foreignKey: 'yearId' });
StudentClass.belongsTo(Class, { foreignKey: 'gradeId', constraints: true });
Class.hasMany(StudentClass, { foreignKey: 'gradeId' });
StudentClass.belongsTo(Student);
Student.hasMany(StudentClass);

const queryInterface = sequelize.getQueryInterface();
queryInterface.addConstraint('student_class', {
  fields: ['gradeId', 'yearId', 'classOrder', 'studentId'],
  type: 'primary key',
});
queryInterface.addConstraint('student_class', {
  fields: ['gradeId', 'yearId'],
  type: 'foreign key',
});

StudentClass.sync({ force: true });

module.exports = StudentClass;
