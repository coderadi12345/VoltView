import { Device } from '../models/Device.js';
import { EnergyLog } from '../models/EnergyLog.js';
import { Setting } from '../models/Setting.js';
import { emitToOrganization } from '../sockets/socket.js';

export const startEnergySimulationJob = () => {
  // Always run simulation to populate logs
  console.log('Energy simulator started. Generating logs every 5 seconds...');

  setInterval(async () => {
    const devices = await Device.find({ status: 'online' }).limit(25);

    await Promise.all(
      devices.map(async (device) => {
        const setting = await Setting.findOne({ organization: device.organization });
        const unitsConsumed = Number(((device.wattage / 1000) * (Math.random() * 1.5 + 0.25)).toFixed(2));
        const log = await EnergyLog.create({
          organization: device.organization,
          building: device.building,
          room: device.room,
          device: device._id,
          unitsConsumed,
          cost: unitsConsumed * (setting?.electricityRate || 7),
          timestamp: new Date()
        });

        emitToOrganization(device.organization, 'energy:update', log);
      })
    );
  }, 5000);
};
