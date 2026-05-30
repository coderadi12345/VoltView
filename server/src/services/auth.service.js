import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';
import { hashToken, signAccessToken, signRefreshToken, signResetToken } from '../utils/tokens.js';
import { sendMail } from '../utils/mailer.js';

export const issueTokens = (user) => ({
  accessToken: signAccessToken(user),
  refreshToken: signRefreshToken(user)
});

import mongoose from 'mongoose';

export const registerUser = async (payload) => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) throw new ApiError(409, 'Email is already registered');

  // Create a private workspace organization for the new user
  const orgName = `${payload.name}'s Workspace`;
  const slug = `${payload.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${crypto.randomBytes(4).toString('hex')}`;
  
  const org = await mongoose.model('Organization').create({
    name: orgName,
    slug: slug,
    industry: 'Other',
    isActive: true
  });

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({
    ...payload,
    role: 'user',
    organization: org._id,
    emailVerificationHash: hashToken(verificationToken)
  });

  await sendMail({
    to: user.email,
    subject: 'Verify your VoltView account',
    html: `<p>Use this verification token: <strong>${verificationToken}</strong></p>`
  });

  return { user, ...issueTokens(user), verificationToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) throw new ApiError(403, 'Account is disabled');
  return { user, ...issueTokens(user) };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new ApiError(401, 'Refresh token is required');

  const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  return issueTokens(user);
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return;

  const resetToken = signResetToken(user);
  user.passwordResetHash = hashToken(resetToken);
  user.passwordResetExpires = new Date(Date.now() + 20 * 60 * 1000);
  await user.save();

  await sendMail({
    to: user.email,
    subject: 'Reset your VoltView password',
    html: `<p>Use this reset token within 20 minutes:</p><p><strong>${resetToken}</strong></p>`
  });
};

export const resetPassword = async ({ token, password }) => {
  const payload = jwt.verify(token, env.jwtResetSecret);
  const user = await User.findById(payload.sub).select('+password');

  if (!user || user.passwordResetHash !== hashToken(token) || user.passwordResetExpires < new Date()) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = password;
  user.passwordResetHash = undefined;
  user.passwordResetExpires = undefined;
  user.tokenVersion += 1;
  await user.save();
};

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  user.tokenVersion += 1;
  await user.save();
};
