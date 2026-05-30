import { body } from 'express-validator';

export const registerRules = [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').optional().isIn(['super_admin', 'admin', 'manager', 'user'])
];

export const loginRules = [body('email').isEmail().normalizeEmail(), body('password').notEmpty()];

export const forgotPasswordRules = [body('email').isEmail().normalizeEmail()];

export const resetPasswordRules = [body('token').notEmpty(), body('password').isLength({ min: 8 })];

export const changePasswordRules = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 })
];
