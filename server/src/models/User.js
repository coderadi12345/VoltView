import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const USER_ROLES = ['super_admin', 'admin', 'manager', 'user'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: USER_ROLES, default: 'user' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    assignedBuildings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Building' }],
    assignedDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0 },
    passwordResetHash: String,
    passwordResetExpires: Date,
    emailVerificationHash: String
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  delete user.passwordResetHash;
  delete user.emailVerificationHash;
  return user;
};

export const User = mongoose.model('User', userSchema);
