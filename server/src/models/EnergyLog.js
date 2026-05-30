import mongoose from 'mongoose';

const energyLogSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    building: { type: String, required: true },
    room: { type: String, required: true },
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    unitsConsumed: { type: Number, required: true, min: 0 },
    cost: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    granularity: { type: String, enum: ['hourly', 'daily', 'monthly', 'yearly'], default: 'hourly' }
  },
  { timestamps: true }
);

energyLogSchema.index({ organization: 1, timestamp: -1 });
energyLogSchema.index({ device: 1, timestamp: -1 });

export const EnergyLog = mongoose.model('EnergyLog', energyLogSchema);
