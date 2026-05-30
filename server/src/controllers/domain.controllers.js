import { Alert } from '../models/Alert.js';
import { AuditLog } from '../models/AuditLog.js';
import { Bill } from '../models/Bill.js';
import { Building } from '../models/Building.js';
import { Device } from '../models/Device.js';
import { EnergyLog } from '../models/EnergyLog.js';
import { Floor } from '../models/Floor.js';
import { Notification } from '../models/Notification.js';
import { Organization } from '../models/Organization.js';
import { Room } from '../models/Room.js';
import { Setting } from '../models/Setting.js';
import { User } from '../models/User.js';
import { createCrudController } from './crud.controller.js';

export const organizationController = createCrudController({
  model: Organization,
  entityName: 'Organization',
  populate: ['managers']
});

export const userController = createCrudController({
  model: User,
  entityName: 'User',
  populate: ['organization', 'assignedBuildings', 'assignedDevices']
});

export const buildingController = createCrudController({
  model: Building,
  entityName: 'Building',
  populate: ['organization', 'manager']
});

export const floorController = createCrudController({
  model: Floor,
  entityName: 'Floor',
  populate: ['organization', 'building']
});

export const roomController = createCrudController({
  model: Room,
  entityName: 'Room',
  populate: ['organization', 'building', 'floor']
});

export const deviceController = createCrudController({
  model: Device,
  entityName: 'Device',
  populate: ['organization', 'floor']
});

export const energyLogController = createCrudController({
  model: EnergyLog,
  entityName: 'EnergyLog',
  populate: ['device', 'building', 'room']
});

export const billController = createCrudController({
  model: Bill,
  entityName: 'Bill',
  populate: ['organization', 'building', 'room', 'device']
});

export const alertController = createCrudController({
  model: Alert,
  entityName: 'Alert',
  populate: ['device', 'building']
});

export const notificationController = createCrudController({
  model: Notification,
  entityName: 'Notification',
  populate: ['user']
});

export const auditLogController = createCrudController({
  model: AuditLog,
  entityName: 'AuditLog',
  populate: ['actor']
});

export const settingController = createCrudController({
  model: Setting,
  entityName: 'Setting',
  populate: ['organization']
});
