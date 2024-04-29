const { sequelize, DataTypes } = require('../utils/db.util');
const User = require('./user.model');

const Parent = sequelize.define('parent', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  relation: {
    type: DataTypes.ENUM(['father', 'mother', 'guardian', 'other']),
    allowNull: false,
  },
});

User.hasMany(Parent, { foreignKey: 'studentId' });
Parent.belongsTo(User, { foreignKey: 'studentId' });

Parent.sync();

module.exports = Parent;
