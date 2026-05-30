import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { connectDB } from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await connectDB();
  const users = await User.find();
  for (const user of users) {
    user.password = 'VoltView!Secure@2026'; // New secure password
    await user.save();
    console.log(`Updated password for ${user.email}`);
  }
  process.exit(0);
};
run();
