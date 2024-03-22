const jwt = require('jsonwebtoken');
const ApiError = require('../api-error');
const config = require('../configs');
const JWT_SECRET = config.jwt.JWT_SECRET;

const requireAuth = (req, res, next) => {
  const token = req?.cookies?.jwt;

  if (!token) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return next(new ApiError(401, 'Unauthorized: ' + err.message));
    }
    next();
  });
};

module.exports = { requireAuth };
