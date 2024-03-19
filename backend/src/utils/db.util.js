const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const { db } = require('../configs');

const sequelize = new Sequelize(db.DB, db.USER, db.PASSWORD, {
  host: db.HOST,
  dialect: db.dialect,
  operationAliases: false,
  logging: false,
  pool: db.pool,
  define: {
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  },
});

module.exports = { sequelize, DataTypes };
