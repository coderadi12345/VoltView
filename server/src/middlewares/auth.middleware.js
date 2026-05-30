import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  const payload = jwt.verify(token, env.jwtAccessSecret);
  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid or inactive account');
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};

import mongoose from 'mongoose';

export const organizationScope = asyncHandler(async (req, _res, next) => {
  if (req.user.role !== 'super_admin') {
    req.query.organization = String(req.user.organization);
    req.body.organization = req.body.organization || req.user.organization;
  } else {
    // Fallback for super_admin if organization is not provided
    if (!req.body.organization && !req.query.organization && req.method !== 'GET') {
      const org = await mongoose.model('Organization').findOne();
      if (org) {
        req.body.organization = org._id.toString();
        req.query.organization = org._id.toString();
      }
    }
  }
  next();
});
