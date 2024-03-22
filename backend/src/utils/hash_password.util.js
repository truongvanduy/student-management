const bcrypt = require('bcrypt');
const config = require('../configs');
const SALT_ROUNDS = config.bcrypt.SALT_ROUNDS || 10;

module.exports = async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw error;
  }
};
