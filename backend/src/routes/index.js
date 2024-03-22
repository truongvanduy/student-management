const express = require('express');
const studentController = require('../controllers/student.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Authentication
router.route('/api/student').get(studentController.findByEmail);
router.route('/api/student/login').post(studentController.login);
router.route('/api/student/logout').post(studentController.logout);

// Student
router
  .route('/api/student/profile/:id')
  .get(requireAuth, studentController.show);

module.exports = router;
