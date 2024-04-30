const teacherHomeroomController = require('../../controllers/teacher.homeroom.controller');
const { requireAuth, verifyRole } = require('../../middleware/auth.middleware');

const homeroomRouter = require('express').Router();

// View
homeroomRouter
  .route('/')
  .get(requireAuth, verifyRole('teacher'), teacherHomeroomController.index);

module.exports = homeroomRouter;
