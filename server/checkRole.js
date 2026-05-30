import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { connectDB } from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await connectDB();
  const users = await User.find({ email: { $ne: 'superadmin@voltview.com' } });
  for (const user of users) {
    console.log(`User: ${user.email}, Role: ${user.role}, Org: ${user.organization}`);
  }
  process.exit(0);
};
run();
