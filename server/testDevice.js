import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Device } from './src/models/Device.js';
import { Organization } from './src/models/Organization.js';

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const org = await Organization.findOne();
    console.log('Org:', org);

    const device = new Device({
      name: 'Test',
      type: 'AC',
      wattage: 100,
      building: 'Building A',
      room: 'Room A',
      organization: org ? org._id : undefined
    });

    await device.validate();
    console.log('Validation passed');
  } catch (err) {
    console.error('Validation error:', err);
  } finally {
    process.exit(0);
  }
};
test();
