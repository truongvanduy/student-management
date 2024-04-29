const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;

module.exports = {
  createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: maxAge,
    });
  },
  maxAge,
};
