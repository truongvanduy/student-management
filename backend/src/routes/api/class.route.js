const scoreController = require('../../controllers/score.controller');
const teacherClassController = require('../../controllers/teacher.class.controller');
const { requireAuth, verifyRole } = require('../../middleware/auth.middleware');
const successMiddleware = require('../../middleware/success.middleware');

const classRouter = require('express').Router();

// View
classRouter
  .route('/')
  .get(requireAuth, verifyRole('teacher'), teacherClassController.index);
classRouter
  .route('/score/edit')
  .get(requireAuth, verifyRole('teacher'), teacherClassController.edit)
  .post(requireAuth, verifyRole('teacher'), teacherClassController.update);
// Create
// classRouter
//   .route('/create')
//   .get(requireAuth, verifyRole('admin'), teacherClassController.create)
//   .post(
//     requireAuth,
//     verifyRole('admin'),
//     teacherClassController.store,
//     successMiddleware('Thêm giáo viên thành công')
//   );
// // Edit
// classRouter
//   .route('/edit/:id')
//   .get(requireAuth, verifyRole('admin'), teacherClassController.edit)
//   .patch(
//     requireAuth,
//     verifyRole('admin'),
//     teacherClassController.update,
//     successMiddleware('Cập nhật giáo viên thành công')
//   );
// // Delete
// classRouter
//   .route('/delete/:id')
//   .delete(
//     requireAuth,
//     verifyRole('admin'),
//     teacherClassController.destroy,
//     successMiddleware('Xóa giáo viên thành công')
//   );

module.exports = classRouter;
