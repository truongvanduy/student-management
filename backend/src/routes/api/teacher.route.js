const teacherAdminController = require('../../controllers/teacher.admin.controller');
const { requireAuth, verifyRole } = require('../../middleware/auth.middleware');
const successMiddleware = require('../../middleware/success.middleware');

const teacherRouter = require('express').Router();

// View
teacherRouter
  .route('/')
  .get(requireAuth, verifyRole('admin'), teacherAdminController.index);
// Create
teacherRouter
  .route('/create')
  .get(requireAuth, verifyRole('admin'), teacherAdminController.create)
  .post(
    requireAuth,
    verifyRole('admin'),
    teacherAdminController.store,
    successMiddleware('Thêm giáo viên thành công')
  );
// Edit
teacherRouter
  .route('/edit/:id')
  .get(requireAuth, verifyRole('admin'), teacherAdminController.edit)
  .patch(
    requireAuth,
    verifyRole('admin'),
    teacherAdminController.update,
    successMiddleware('Cập nhật giáo viên thành công')
  );
// Delete
teacherRouter
  .route('/delete/:id')
  .delete(
    requireAuth,
    verifyRole('admin'),
    teacherAdminController.destroy,
    successMiddleware('Xóa giáo viên thành công')
  );

module.exports = teacherRouter;
