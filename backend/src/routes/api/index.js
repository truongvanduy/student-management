const {
  requireAuth,
  checkStudent,
  verifyRole,
} = require('../../middleware/auth.middleware');
const scoreController = require('../../controllers/score.controller');
const courseController = require('../../controllers/course.controller');
const yearController = require('../../controllers/year.controller');
const apiRouter = require('express').Router();

// Score
apiRouter
  .route('/student/score')
  .get(requireAuth, verifyRole('student'), scoreController.show);

// Courses
apiRouter.route('/courses').get(requireAuth, courseController.show);

// Year
apiRouter.route('/year').get(requireAuth, yearController.show);
apiRouter
  .route('/year/student')
  .get(requireAuth, checkStudent, yearController.getStudentYear);

apiRouter.use('/user', require('./user.route'));
apiRouter.use('/student', require('./student.route'));

module.exports = apiRouter;
