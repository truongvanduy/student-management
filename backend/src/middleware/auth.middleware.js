const jwt = require('jsonwebtoken');
const ApiError = require('../api-error');
const config = require('../configs');
const Student = require('../models/student.model');
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

    const student = await Student.findByPk(decodedToken.id);
    req.student = student;
    next();
  });
};

module.exports = { requireAuth, checkStudent };
