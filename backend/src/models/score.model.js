const { sequelize, DataTypes } = require('../utils/db.util');
const Course = require('./course.model');
const Semester = require('./semester.model');
const Student = require('./student.model');
const Year = require('./year.model');

const Score = sequelize.define('score', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  score: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('regular', 'midterm', 'final'),
    allowNull: false,
  },
});

Year.hasMany(Score, { foreignKey: 'yearId' });
Score.belongsTo(Year, { foreignKey: 'yearId' });

Semester.hasMany(Score, { foreignKey: 'semesterId' });
Score.belongsTo(Semester, { foreignKey: 'semesterId' });

Course.hasMany(Score, { foreignKey: 'courseId' });
Score.belongsTo(Course, { foreignKey: 'courseId' });

Student.hasMany(Score, { foreignKey: 'studentId' });
Score.belongsTo(Student, { foreignKey: 'studentId' });

Score.sync({ alter: true });

module.exports = Score;
