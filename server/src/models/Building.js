import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    address: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    areaSqFt: Number,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Building = mongoose.model('Building', buildingSchema);
