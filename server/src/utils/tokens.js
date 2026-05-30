import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export const signAccessToken = (user) =>
  jwt.sign(
    { sub: user._id, role: user.role, organization: user.organization },
    env.jwtAccessSecret,
    { expiresIn: env.accessTokenTtl }
  );

export const signRefreshToken = (user) =>
  jwt.sign({ sub: user._id, tokenVersion: user.tokenVersion }, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenTtl
  });

export const signResetToken = (user) =>
  jwt.sign({ sub: user._id, purpose: 'password-reset' }, env.jwtResetSecret, {
    expiresIn: '20m'
  });

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
