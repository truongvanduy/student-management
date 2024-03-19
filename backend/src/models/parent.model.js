const { sequelize, DataTypes } = require('../utils/db.util');

const Parent = sequelize.define(
  'parent',
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.ENUM(['']),
      allowNull: false,
    },
  },
  {
    primaryKey: {
      fields: ['studentId', 'relationship'],
    },
  }
);

module.exports = Parent;
