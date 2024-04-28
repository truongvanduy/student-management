const jwt = require('jsonwebtoken');
const ApiError = require('../api-error');
const config = require('../configs');
const User = require('../models/user.model');
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

const checkStudent = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    req.student = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.log(error.mesage);
      req.student = null;
      return next();
    }

    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      req.student = null;
      return next();
    }
    if (user.role !== 'student' || decodedToken.role !== 'student') {
      req.student = null;
      return next();
    }
    req.student = user;
    next();
  });
};

const verifyRole = (role) => (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    req[role] = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.log(error.mesage);
      req[role] = null;
      return next();
    }

    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      req[role] = null;
      return next();
    }
    if (user.role !== role || decodedToken.role !== role) {
      req[role] = null;
      return next();
    }
    req[role] = user;
    next();
  });
};

module.exports = { requireAuth, checkStudent, verifyRole };
