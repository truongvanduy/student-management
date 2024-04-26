const jwt = require('jsonwebtoken');
const ApiError = require('../api-error');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { createToken, maxAge } = require('../utils/token.util');

module.exports = {
  async show(req, res, next) {
    try {
      const id = req.params.id;
      const user = await User.findByPk(id, {
        attributes: [
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
          'address',
          'dateOfBirth',
          'role',
        ],
        raw: true,
      });
      if (user == null) {
        return next(new ApiError(404, 'Student not found.'));
      }
      const response = user;

      return res.send(response);
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while retrieving student info: ${error.message}`
        )
      );
    }
  },

  async findByEmail(req, res, next) {
    const email = req.query.email;
    if (!email) {
      return next(new ApiError(400, 'Email is required'));
    }

    try {
      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        return next(new ApiError(404, 'User not found.'));
      }

      // Return email if not authenticated
      const token = req.cookies.jwt;
      if (!token) {
        return res.send({
          email: user.email,
          authenticated: false,
        });
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return res.send({
            email: user.email,
            authenticated: false,
          });
        }
        // Return student info if authenticated
        return res.send({
          authenticated: true,
          student: {
            id: user.id,
            email: user.email,
          },
        });
      });
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while finding student: ${error.message}`
        )
      );
    }
  },

  async login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Bạn chưa nhập email hoặc mật khẩu'));
    }

    try {
      // If email exists
      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        return next(new ApiError(404, 'Không tìm thấy người dùng này'));
      }

      // If password is correct
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        return next(new ApiError(401, 'Mật khẩu không đúng'));
      }

      // Assign token
      const token = createToken({ id: user.id, role: user.role });
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

      return res.send({
        authenticated: true,
        user: { id: user.id, role: user.role },
      });
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Error occurred while retrieving student info: ${error.message}`
        )
      );
    }
  },

  async logout(req, res, next) {
    res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
    return res.send();
  },
};
