import mongoose from 'mongoose';

const tariffRuleSchema = new mongoose.Schema(
  {
    from: { type: Number, required: true },
    to: Number,
    rate: { type: Number, required: true }
  },
  { _id: false }
);

const settingSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, unique: true },
    electricityRate: { type: Number, default: 7 },
    billingType: { type: String, enum: ['flat', 'slab', 'custom'], default: 'slab' },
    tariffRules: {
      type: [tariffRuleSchema],
      default: [
        { from: 0, to: 100, rate: 5 },
        { from: 101, to: 300, rate: 7 },
        { from: 301, rate: 10 }
      ]
    },
    thresholds: {
      highConsumptionUnitsDaily: { type: Number, default: 250 },
      monthlyBudget: { type: Number, default: 50000 },
      runtimeHours: { type: Number, default: 12 }
    },
    preferences: {
      timezone: { type: String, default: 'Asia/Kolkata' },
      currency: { type: String, default: 'INR' }
    }
  },
  { timestamps: true }
);

export const Setting = mongoose.model('Setting', settingSchema);
