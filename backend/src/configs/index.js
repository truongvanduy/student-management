require('dotenv').config();

const { PORT, HOST, USER, PASSWORD, DB, dialect } = process.env;

if (!HOST || !USER || !PASSWORD || !DB || !dialect) {
  throw new Error('Missing required environment variable');
}

const config = {
  app: {
    PORT: process.env.PORT || 3000,
  },
  db: {
    PORT,
    HOST,
    USER,
    PASSWORD,
    DB,
    dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

module.exports = config;
