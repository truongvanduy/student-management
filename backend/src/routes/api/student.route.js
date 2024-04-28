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
    successMiddleware('Thêm học sinh thành công')
  );
// Edit
studentRouter
  .route('/edit/:id')
  .get(requireAuth, verifyRole('admin'), studentAdminController.edit)
  .patch(
    requireAuth,
    verifyRole('admin'),
    studentAdminController.update,
    successMiddleware('Cập nhật học sinh thành công')
  );
// Delete
studentRouter
  .route('/delete/:id')
  .delete(
    requireAuth,
    verifyRole('admin'),
    studentAdminController.destroy,
    successMiddleware('Xóa học sinh thành công')
  );

module.exports = studentRouter;
