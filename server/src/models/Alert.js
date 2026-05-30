import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
    type: {
      type: String,
      enum: ['high_consumption', 'budget_exceeded', 'runtime_exceeded', 'threshold_reached'],
      required: true
    },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
    resolvedAt: Date
  },
  { timestamps: true }
);

export const Alert = mongoose.model('Alert', alertSchema);
