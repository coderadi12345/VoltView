import { connectDB } from '../config/db.js';
import { Alert } from '../models/Alert.js';
import { AuditLog } from '../models/AuditLog.js';
import { Bill } from '../models/Bill.js';
import { Building } from '../models/Building.js';
import { Device } from '../models/Device.js';
import { EnergyLog } from '../models/EnergyLog.js';
import { Floor } from '../models/Floor.js';
import { Notification } from '../models/Notification.js';
import { Organization } from '../models/Organization.js';
import { Report } from '../models/Report.js';
import { Room } from '../models/Room.js';
import { Setting } from '../models/Setting.js';
import { User } from '../models/User.js';

const randomBetween = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Organization.deleteMany({}),
    Building.deleteMany({}),
    Floor.deleteMany({}),
    Room.deleteMany({}),
    Device.deleteMany({}),
    EnergyLog.deleteMany({}),
    Bill.deleteMany({}),
    Alert.deleteMany({}),
    Notification.deleteMany({}),
    Report.deleteMany({}),
    AuditLog.deleteMany({}),
    Setting.deleteMany({})
  ]);

  const organization = await Organization.create({
    name: 'VoltView Demo Energy Co.',
    slug: 'voltview-demo',
    industry: 'Smart Facilities',
    contactEmail: 'ops@voltview.com'
  });

  const [superAdmin, admin, manager, user] = await User.create([
    { name: 'Super Admin', email: 'superadmin@voltview.com', password: 'VoltView!Secure@2026', role: 'super_admin', organization: organization._id, isEmailVerified: true },
    { name: 'Asha Admin', email: 'admin@voltview.com', password: 'VoltView!Secure@2026', role: 'admin', organization: organization._id, isEmailVerified: true },
    { name: 'Maya Manager', email: 'manager@voltview.com', password: 'VoltView!Secure@2026', role: 'manager', organization: organization._id, isEmailVerified: true },
    { name: 'Rohan User', email: 'user@voltview.com', password: 'VoltView!Secure@2026', role: 'user', organization: organization._id, isEmailVerified: true }
  ]);

  organization.managers = [manager._id];
  await organization.save();

  const building = await Building.create({
    name: 'Innovation Tower',
    organization: organization._id,
    address: 'Bengaluru Tech Park',
    manager: manager._id,
    areaSqFt: 80000
  });

  const floors = await Floor.create([
    { name: 'Ground Floor', number: 0, organization: organization._id, building: building._id },
    { name: 'First Floor', number: 1, organization: organization._id, building: building._id },
    { name: 'Second Floor', number: 2, organization: organization._id, building: building._id }
  ]);

  const rooms = await Room.create([
    { name: 'Reception', organization: organization._id, building: building._id, floor: floors[0]._id, type: 'Lobby' },
    { name: 'Engineering Bay', organization: organization._id, building: building._id, floor: floors[1]._id, type: 'Workspace' },
    { name: 'Conference Alpha', organization: organization._id, building: building._id, floor: floors[2]._id, type: 'Meeting Room' }
  ]);

  const devices = await Device.create([
    { name: 'Lobby AC', type: 'AC', wattage: 1800, status: 'online', organization: organization._id, building: building._id, floor: floors[0]._id, room: rooms[0]._id, runtimeHours: 7.5 },
    { name: 'Reception Lights', type: 'Light', wattage: 450, status: 'online', organization: organization._id, building: building._id, floor: floors[0]._id, room: rooms[0]._id, runtimeHours: 12 },
    { name: 'Engineering Workstations', type: 'Laptop', wattage: 2400, status: 'online', organization: organization._id, building: building._id, floor: floors[1]._id, room: rooms[1]._id, runtimeHours: 9 },
    { name: 'Conference Display', type: 'TV', wattage: 350, status: 'offline', organization: organization._id, building: building._id, floor: floors[2]._id, room: rooms[2]._id, runtimeHours: 2.5 },
    { name: 'Pantry Refrigerator', type: 'Refrigerator', wattage: 600, status: 'online', organization: organization._id, building: building._id, floor: floors[1]._id, room: rooms[1]._id, runtimeHours: 24 }
  ]);

  const setting = await Setting.create({ organization: organization._id });

  const logs = [];
  for (let day = 0; day < 30; day += 1) {
    for (const device of devices) {
      const unitsConsumed = randomBetween(4, 38);
      logs.push({
        organization: organization._id,
        building: building._id,
        room: device.room,
        device: device._id,
        unitsConsumed,
        cost: unitsConsumed * setting.electricityRate,
        timestamp: new Date(Date.now() - day * 24 * 60 * 60 * 1000),
        granularity: 'daily'
      });
    }
  }
  await EnergyLog.create(logs);

  await Alert.create({
    organization: organization._id,
    device: devices[0]._id,
    building: building._id,
    type: 'runtime_exceeded',
    severity: 'high',
    title: 'AC runtime exceeded',
    message: 'Lobby AC has crossed the configured runtime threshold.'
  });

  await Notification.create({
    organization: organization._id,
    user: admin._id,
    title: 'Welcome to VoltView',
    message: 'Your smart energy command center is ready.'
  });

  await AuditLog.create({ organization: organization._id, actor: superAdmin._id, action: 'seed.run', entityType: 'System' });
  console.log('Seed data created successfully');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
