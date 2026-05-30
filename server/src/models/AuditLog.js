import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    metadata: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

auditLogSchema.index({ organization: 1, createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
