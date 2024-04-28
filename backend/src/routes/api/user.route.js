const userController = require('../../controllers/user.controller');
const { requireAuth } = require('../../middleware/auth.middleware');

const userRouter = require('express').Router();

userRouter.route('/').get(userController.findByEmail);
userRouter.route('/login').post(userController.login);
userRouter.route('/logout').post(requireAuth, userController.logout);
userRouter.route('/profile/:id').get(requireAuth, userController.show);

module.exports = userRouter;
