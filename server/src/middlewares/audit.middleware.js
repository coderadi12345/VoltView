import { AuditLog } from '../models/AuditLog.js';

export const writeAuditLog = async ({ req, action, entityType, entityId, metadata }) => {
  try {
    await AuditLog.create({
      organization: req.user?.organization,
      actor: req.user?._id,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress: req.ip,
      userAgent: req.headers?.['user-agent']
    });
  } catch (error) {
    console.error('Audit log failed', error.message);
  }
};
