const { sequelize, DataTypes } = require('../utils/db.util');

const Score = sequelize.define('score', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('regular', 'midterm', 'final'),
    allowNull: false,
  },
});

module.exports = Score;
