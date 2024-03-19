const Student = require('./student.model');
const Grade = require('./grade.model');
const Year = require('./year.model');
const Semester = require('./semester.model');
const Course = require('./course.model');
const Score = require('./score.model');
const Class = require('./class.model');
const Parent = require('./parent.model');

// Dependencies for weak entity Class
Year.hasMany(Class, { foreignKey: 'yearId' });
Class.belongsTo(Year, { foreignKey: 'yearId' });

Grade.hasMany(Class, { foreignKey: 'gradeId' });
Class.belongsTo(Grade, { foreignKey: 'gradeId' });

// Score associations
Year.hasMany(Score, { foreignKey: 'yearId' });
Score.belongsTo(Year, { foreignKey: 'yearId' });

Semester.hasMany(Score, { foreignKey: 'semesterId' });
Score.belongsTo(Semester, { foreignKey: 'semesterId' });

Course.hasMany(Score, { foreignKey: 'courseId' });
Score.belongsTo(Course, { foreignKey: 'courseId' });

Student.hasMany(Score, { foreignKey: 'studentId' });
Score.belongsTo(Student, { foreignKey: 'studentId' });

// Parent associations
Student.hasMany(Parent, { foreignKey: 'studentId' });
Parent.belongsTo(Student, { foreignKey: 'studentId' });

const associations = {
  Student,
  Parent,
  Grade,
  Year,
  Semester,
  Course,
  Score,
  Class,
};

module.exports = associations;
