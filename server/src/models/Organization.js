import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    industry: { type: String, default: 'Commercial' },
    contactEmail: { type: String, trim: true },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    settings: {
      currency: { type: String, default: 'INR' },
      monthlyBudget: { type: Number, default: 50000 },
      carbonFactorKgPerKwh: { type: Number, default: 0.82 }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Organization = mongoose.model('Organization', organizationSchema);
