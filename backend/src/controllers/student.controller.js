const jwt = require('jsonwebtoken');
const ApiError = require('../api-error');
const Student = require('../models/student.model');
const StudentClass = require('../models/student_class.model');
const bcrypt = require('bcrypt');
const { createToken, maxAge } = require('../utils/token.util');
const Class = require('../models/class.model');
const Grade = require('../models/grade.model');
const { raw } = require('express');

module.exports = {
  async show(req, res, next) {
    try {
      const id = req.params.id;
      const student = await Student.findByPk(id, {
        attributes: [
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
          'address',
          'dateOfBirth',
        ],
        raw: true,
      });
      if (student == null) {
        return next(new ApiError(404, 'Student not found.'));
      }

      const studentClass = await StudentClass.findOne({
        where: { studentId: id },
        order: [['yearId', 'DESC']],
        include: [Grade],
      });

      const response = {
        ...student,
        className: `${studentClass.Grade.gradeLevel}.${studentClass.classOrder}`,
      };

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
      const student = await Student.findOne({
        where: { email },
      });
      if (!student) {
        return next(new ApiError(404, 'Student not found.'));
      }

      // Return email if not authenticated
      const token = req.cookies.jwt;
      if (!token) {
        return res.send({
          email: student.email,
          authenticated: false,
        });
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return res.send({
            email: student.email,
            authenticated: false,
          });
        }
        // Return student info if authenticated
        return res.send({
          authenticated: true,
          student: {
            id: student.id,
            email: student.email,
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
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Bạn chưa nhập email hoặc mật khẩu'));
    }

    try {
      // If email exists
      const student = await Student.findOne({
        where: { email },
      });
      if (!student) {
        return next(new ApiError(404, 'Không tìm thấy học sinh này'));
      }

      // If password is correct
      const passwordMatched = await bcrypt.compare(password, student.password);
      if (!passwordMatched) {
        return next(new ApiError(401, 'Mật khẩu không đúng'));
      }

      // Assign token
      const token = createToken(student.id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

      return res.send({ authenticated: true, student: student });
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
