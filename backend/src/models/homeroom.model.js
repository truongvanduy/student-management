const { sequelize, DataTypes } = require('../utils/db.util');
const Class = require('./class.model');
const Grade = require('./grade.model');
const User = require('./user.model');
const Year = require('./year.model');

const Homeroom = sequelize.define('homeroom', {
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
});

Homeroom.belongsTo(Grade, { foreignKey: 'gradeId' });
Grade.hasOne(Homeroom, { foreignKey: 'gradeId' });

Homeroom.belongsTo(User, { foreignKey: 'teacherId' });
User.hasOne(Homeroom, { foreignKey: 'teacherId' });

Homeroom.belongsTo(Class, { foreignKey: 'classOrder' });
Class.hasOne(Homeroom, { foreignKey: 'classOrder' });

Homeroom.belongsTo(Year, { foreignKey: 'yearId' });
Year.hasOne(Homeroom, { foreignKey: 'yearId' });

Homeroom.sync({});

module.exports = Homeroom;
