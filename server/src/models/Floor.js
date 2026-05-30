import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    number: { type: Number, required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Floor = mongoose.model('Floor', floorSchema);
