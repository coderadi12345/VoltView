import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    channel: { type: String, enum: ['in_app', 'email'], default: 'in_app' },
    type: { type: String, default: 'system' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    readAt: Date
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
