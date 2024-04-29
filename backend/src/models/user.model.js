const { sequelize, DataTypes } = require('../utils/db.util');
const removeDiacritics = require('../utils/diacritics_removal');
const hash_passwordUtil = require('../utils/hash_password.util');

const sequence = function (id) {
  return 's' + String(id + 1).padStart(5, '0');
};

const User = sequelize.define('User', {
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
  placeOfBirth: {
    type: DataTypes.STRING,
    allowNull: true,
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
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.addHook('beforeCreate', async (user, options) => {
  user.password = await hash_passwordUtil(user?.password || user.phoneNumber);
});

User.addHook('afterCreate', async (user, options) => {
  user.email = removeDiacritics(
    `${user.firstName}${sequence(user.id)}@${user.role}.hc.edu.vn`
  ).toLowerCase();
  await user.save();
});

User.addHook('beforeBulkCreate', async (users, options) => {
  for (const user of users) {
    user.password = await hash_passwordUtil(user.password);
  }
});

User.sync();

module.exports = User;
