import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
    type: { type: String, default: 'Workspace' },
    capacity: Number,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Room = mongoose.model('Room', roomSchema);
