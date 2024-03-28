require('dotenv').config();

const { PORT, HOST, USER, PASSWORD, DB, dialect, SALT_ROUNDS, JWT_SECRET } =
  process.env;

if (
  !HOST ||
  !USER ||
  !PASSWORD ||
  !DB ||
  !dialect ||
  !SALT_ROUNDS ||
  !JWT_SECRET
) {
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
  bcrypt: {
    SALT_ROUNDS: parseInt(SALT_ROUNDS),
  },
  jwt: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

module.exports = config;
