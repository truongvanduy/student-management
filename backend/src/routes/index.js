const express = require('express');
const studentController = require('../controllers/student.controller');
const { requireAuth, checkStudent } = require('../middleware/auth.middleware');
const scoreController = require('../controllers/score.controller');
const courseController = require('../controllers/course.controller');
const yearController = require('../controllers/year.controller');

const router = express.Router();

// Authentication
router.route('/api/student').get(studentController.findByEmail);
router.route('/api/student/login').post(studentController.login);
router.route('/api/student/logout').post(studentController.logout);

// Student
router
  .route('/api/student/profile/:id')
  .get(requireAuth, studentController.show);

// Score
router
  .route('/api/student/score')
  .get(requireAuth, checkStudent, scoreController.show);

// Courses
router.route('/api/courses').get(requireAuth, courseController.show);

// Year
router
  .route('/api/year/student')
  .get(requireAuth, checkStudent, yearController.getStudentYear);

module.exports = router;
