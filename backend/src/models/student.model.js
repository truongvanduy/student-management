const { sequelize, DataTypes } = require('../utils/db.util');
const hash_passwordUtil = require('../utils/hash_password.util');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Student.addHook('beforeCreate', async (student, options) => {
  student.password = await hash_passwordUtil(student.password);
});

Student.addHook('beforeBulkCreate', async (students, options) => {
  for (const student of students) {
    student.password = await hash_passwordUtil(student.password);
  }
});

Student.sync();

module.exports = Student;
