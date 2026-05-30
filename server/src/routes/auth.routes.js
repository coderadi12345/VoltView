import { Router } from 'express';
import {
  changePasswordController,
  forgotPassword,
  login,
  logout,
  me,
  refreshToken,
  register,
  resetPasswordController
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  changePasswordRules,
  forgotPasswordRules,
  loginRules,
  registerRules,
  resetPasswordRules
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, resetPasswordController);
router.post('/change-password', protect, changePasswordRules, validate, changePasswordController);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

export default router;
