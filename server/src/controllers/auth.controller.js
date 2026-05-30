import {
  changePassword,
  loginUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset,
  resetPassword
} from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { writeAuditLog } from '../middlewares/audit.middleware.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  await writeAuditLog({ req: { ...req, user: result.user }, action: 'login', entityType: 'User', entityId: result.user._id });
  res.json({ success: true, data: result });
});

export const logout = asyncHandler(async (req, res) => {
  req.user.tokenVersion += 1;
  await req.user.save();
  await writeAuditLog({ req, action: 'logout', entityType: 'User', entityId: req.user._id });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const tokens = await refreshAccessToken(req.body.refreshToken);
  res.json({ success: true, data: tokens });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await requestPasswordReset(req.body.email);
  res.json({ success: true, message: 'Password reset instructions sent if the account exists' });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  await resetPassword(req.body);
  res.json({ success: true, message: 'Password reset successful' });
});

export const changePasswordController = asyncHandler(async (req, res) => {
  await changePassword({ userId: req.user._id, ...req.body });
  res.json({ success: true, message: 'Password changed successfully' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});
