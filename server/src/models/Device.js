import mongoose from 'mongoose';

export const DEVICE_TYPES = [
  'AC',
  'Fan',
  'Light',
  'TV',
  'Refrigerator',
  'Laptop',
  'Water Heater',
  'Custom Device'
];

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: DEVICE_TYPES, default: 'Custom Device' },
    wattage: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['online', 'offline', 'disabled'], default: 'online' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    building: { type: String, required: true },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
    room: { type: String, required: true },
    runtimeHours: { type: Number, default: 0 },
    description: String,
    lastSeenAt: Date
  },
  { timestamps: true }
);

export const Device = mongoose.model('Device', deviceSchema);
