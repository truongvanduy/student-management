const { where } = require('sequelize');
const { sequelize, DataTypes } = require('../utils/db.util');
const Class = require('./class.model');
const Grade = require('./grade.model');
const User = require('./user.model');
const Year = require('./year.model');

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
Grade.hasMany(StudentClass, { foreignKey: 'gradeId' });

StudentClass.belongsTo(User, { foreignKey: 'studentId' });
User.hasMany(StudentClass, { foreignKey: 'studentId' });

StudentClass.belongsTo(Year, { foreignKey: 'yearId' });
Year.hasMany(StudentClass, { foreignKey: 'yearId' });

StudentClass.belongsTo(Class, { foreignKey: 'classOrder' });
Class.hasMany(StudentClass, { foreignKey: 'classOrder' });

StudentClass.addHook('afterCreate', async (studentClass, options) => {
  const studentCount = await StudentClass.count({
    where: {
      gradeId: studentClass.gradeId,
      yearId: studentClass.yearId,
      classOrder: studentClass.classOrder,
    },
  });
  await Class.update(
    {
      studentCount,
    },
    {
      where: {
        gradeId: studentClass.gradeId,
        yearId: studentClass.yearId,
        order: studentClass.classOrder,
      },
    }
  );
});
StudentClass.addHook('afterDestroy', async (studentClass, options) => {
  const studentCount = await StudentClass.count({
    where: {
      gradeId: studentClass.gradeId,
      yearId: studentClass.yearId,
      classOrder: studentClass.classOrder,
    },
  });
  await Class.update(
    {
      studentCount,
    },
    {
      where: {
        gradeId: studentClass.gradeId,
        yearId: studentClass.yearId,
        order: studentClass.classOrder,
      },
    }
  );
});

StudentClass.sync();

module.exports = StudentClass;
