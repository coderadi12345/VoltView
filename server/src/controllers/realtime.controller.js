import { Alert } from '../models/Alert.js';
import { Device } from '../models/Device.js';
import { EnergyLog } from '../models/EnergyLog.js';
import { Notification } from '../models/Notification.js';
import { Setting } from '../models/Setting.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { emitToOrganization } from '../sockets/socket.js';

import mongoose from 'mongoose';

export const ingestEnergyLog = asyncHandler(async (req, res) => {
  let organization = req.user.role === 'super_admin' ? req.body.organization : req.user.organization;
  if (!organization && req.user.role === 'super_admin') {
    const org = await mongoose.model('Organization').findOne();
    if (org) organization = org._id;
  }
  const setting = await Setting.findOne({ organization });
  const cost = req.body.unitsConsumed * (setting?.electricityRate || 7);
  const log = await EnergyLog.create({ ...req.body, organization, cost });

  emitToOrganization(organization, 'energy:update', log);

  if (log.unitsConsumed >= (setting?.thresholds?.highConsumptionUnitsDaily || 250)) {
    const alert = await Alert.create({
      organization,
      device: log.device,
      building: log.building,
      type: 'high_consumption',
      severity: 'high',
      title: 'High consumption detected',
      message: `A device consumed ${log.unitsConsumed} units.`
    });
    const notification = await Notification.create({
      organization,
      type: 'alert',
      title: alert.title,
      message: alert.message
    });
    emitToOrganization(organization, 'alert:new', alert);
    emitToOrganization(organization, 'notification:new', notification);
  }

  res.status(201).json({ success: true, data: log });
});

export const updateDeviceStatus = asyncHandler(async (req, res) => {
  const device = await Device.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, lastSeenAt: new Date() },
    { new: true, runValidators: true }
  );
  emitToOrganization(device.organization, 'device:update', device);
  res.json({ success: true, data: device });
});
