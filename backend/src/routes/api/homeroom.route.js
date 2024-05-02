const teacherHomeroomController = require('../../controllers/teacher.homeroom.controller');
const { requireAuth, verifyRole } = require('../../middleware/auth.middleware');

const homeroomRouter = require('express').Router();

// View
homeroomRouter
  .route('/')
  .get(requireAuth, verifyRole('teacher'), teacherHomeroomController.index);

homeroomRouter
  .route('/statistics')
  .get(
    requireAuth,
    verifyRole('teacher'),
    teacherHomeroomController.getResultStatistics
  );

homeroomRouter
  .route('/students')
  .get(
    requireAuth,
    verifyRole('teacher'),
    teacherHomeroomController.getStudents
  );
homeroomRouter
  .route('/students/:id/scores')
  .get(
    requireAuth,
    verifyRole('teacher'),
    teacherHomeroomController.getStudentScores
  );

homeroomRouter
  .route('/students/conducts')
  .get(
    requireAuth,
    verifyRole('teacher'),
    teacherHomeroomController.getConducts
  )
  .post(
    requireAuth,
    verifyRole('teacher'),
    teacherHomeroomController.saveConducts
  );
module.exports = homeroomRouter;
