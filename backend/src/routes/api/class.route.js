const teacherClassController = require('../../controllers/teacher.class.controller');
const { requireAuth, verifyRole } = require('../../middleware/auth.middleware');

const classRouter = require('express').Router();

// View
classRouter
  .route('/')
  .get(requireAuth, verifyRole('teacher'), teacherClassController.index);
classRouter
  .route('/score/edit')
  .get(requireAuth, verifyRole('teacher'), teacherClassController.edit)
  .post(requireAuth, verifyRole('teacher'), teacherClassController.update);

module.exports = classRouter;
