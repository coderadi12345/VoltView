import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    building: { type: String },
    room: { type: String },
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    billingType: { type: String, enum: ['flat', 'slab', 'custom'], default: 'slab' },
    units: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    breakdown: [{ label: String, units: Number, rate: Number, amount: Number }],
    status: { type: String, enum: ['draft', 'generated', 'paid'], default: 'generated' }
  },
  { timestamps: true }
);

export const Bill = mongoose.model('Bill', billSchema);
