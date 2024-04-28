const studentAdminController = require('../../controllers/student.admin.controller');
const { requireAuth, verifyRole } = require('../../middleware/auth.middleware');
const successMiddleware = require('../../middleware/success.middleware');

const studentRouter = require('express').Router();

// View
studentRouter
  .route('/')
  .get(requireAuth, verifyRole('admin'), studentAdminController.index);
// Create
studentRouter
  .route('/create')
  .get(requireAuth, verifyRole('admin'), studentAdminController.create)
  .post(
    requireAuth,
    verifyRole('admin'),
    studentAdminController.store,
    successMiddleware
  );
// Edit
studentRouter
  .route('/edit/:id')
  .get(requireAuth, verifyRole('admin'), studentAdminController.edit)
  .patch(requireAuth, verifyRole('admin'), studentAdminController.update);
// Delete
studentRouter
  .route('/delete/:id')
  .delete(requireAuth, verifyRole('admin'), studentAdminController.destroy);

module.exports = studentRouter;
