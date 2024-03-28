const { sequelize, DataTypes } = require('../utils/db.util');
const Student = require('./student.model');

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

Student.hasMany(Parent, { foreignKey: 'studentId' });
Parent.belongsTo(Student, { foreignKey: 'studentId' });

Parent.sync();

module.exports = Parent;
