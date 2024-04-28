const { sequelize, DataTypes } = require('../utils/db.util');
const Student = require('./user.model');

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
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relationship: {
      type: DataTypes.ENUM(['father', 'mother', 'guardian', 'other']),
      allowNull: false,
    },
  },
  {
    primaryKey: {
      fields: ['studentId', 'relationship'],
    },
  }
);

Student.hasMany(Parent, { foreignKey: 'studentId' });
Parent.belongsTo(Student, { foreignKey: 'studentId' });

Parent.sync();

module.exports = Parent;
