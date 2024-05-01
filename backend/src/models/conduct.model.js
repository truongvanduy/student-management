const { sequelize, DataTypes } = require('../utils/db.util');
const Class = require('./class.model');
const User = require('./user.model');
const Semester = require('./semester.model');
const Year = require('./year.model');

const Conduct = sequelize.define('conduct', {
  yearId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  semesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  conduct: {
    type: DataTypes.ENUM('good', 'fair', 'average', 'weak'),
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Conduct.belongsTo(Year, { foreignKey: 'yearId' });
Year.hasMany(Conduct, { foreignKey: 'yearId' });

Conduct.belongsTo(Semester, { foreignKey: 'semesterId' });
Semester.hasMany(Conduct, { foreignKey: 'semesterId' });

Conduct.belongsTo(User, { foreignKey: 'studentId' });
User.hasMany(Conduct, { foreignKey: 'studentId' });

Conduct.sync();

module.exports = Conduct;
