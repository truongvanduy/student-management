const { sequelize, DataTypes } = require('../utils/db.util');

const Semester = sequelize.define('Semester', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  semester: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      isIn: [[1, 2]],
    },
  },
});

Semester.sync();

module.exports = Semester;
