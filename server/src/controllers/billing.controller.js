import { generateBill } from '../services/billing.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { writeAuditLog } from '../middlewares/audit.middleware.js';

import mongoose from 'mongoose';

export const generateBilling = asyncHandler(async (req, res) => {
  let organization = req.user.role === 'super_admin' ? req.body.organization : req.user.organization;
  if (!organization && req.user.role === 'super_admin') {
    const org = await mongoose.model('Organization').findOne();
    if (org) organization = org._id;
  }
  const bill = await generateBill({ ...req.body, organization });
  await writeAuditLog({ req, action: 'billing.generate', entityType: 'Bill', entityId: bill._id });
  res.status(201).json({ success: true, data: bill });
});
