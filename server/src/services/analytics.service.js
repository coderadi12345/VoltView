import { Alert } from '../models/Alert.js';
import { Building } from '../models/Building.js';
import { Device } from '../models/Device.js';
import { EnergyLog } from '../models/EnergyLog.js';
import { Setting } from '../models/Setting.js';

const startOfMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1);

export const calculateEnergyScore = ({ units, budget, cost, activeDevices, totalDevices }) => {
  const consumptionScore = Math.max(0, 35 - units / 100);
  const budgetScore = cost <= budget ? 30 : Math.max(0, 30 - ((cost - budget) / budget) * 30);
  const deviceScore = totalDevices ? (activeDevices / totalDevices) * 20 : 20;
  const peakScore = Math.max(0, 15 - units / 500);
  return Math.round(Math.min(100, consumptionScore + budgetScore + deviceScore + peakScore));
};

export const getDashboardSummary = async (organization) => {
  const match = organization ? { organization } : {};
  const monthMatch = { ...match, timestamp: { $gte: startOfMonth() } };

  const [energy, devices, activeDevices, buildings, alerts, setting, daily, distribution, peak] = await Promise.all([
    EnergyLog.aggregate([{ $match: monthMatch }, { $group: { _id: null, units: { $sum: '$unitsConsumed' }, cost: { $sum: '$cost' } } }]),
    Device.countDocuments(match),
    Device.countDocuments({ ...match, status: 'online' }),
    Building.countDocuments(match),
    Alert.countDocuments({ ...match, isResolved: false }),
    Setting.findOne(match),
    EnergyLog.aggregate([
      { $match: monthMatch },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, units: { $sum: '$unitsConsumed' }, cost: { $sum: '$cost' } } },
      { $sort: { _id: 1 } },
      { $limit: 31 }
    ]),
    Device.aggregate([{ $match: match }, { $group: { _id: '$type', value: { $sum: 1 } } }, { $sort: { value: -1 } }]),
    EnergyLog.aggregate([
      { $match: monthMatch },
      { $group: { _id: { $hour: '$timestamp' }, units: { $sum: '$unitsConsumed' } } },
      { $sort: { units: -1 } },
      { $limit: 8 }
    ])
  ]);

  const units = energy[0]?.units || 0;
  const cost = energy[0]?.cost || 0;
  const budget = setting?.thresholds?.monthlyBudget || 50000;

  return {
    kpis: {
      totalUnits: Number(units.toFixed(2)),
      monthlyCost: Number(cost.toFixed(2)),
      activeDevices,
      totalDevices: devices,
      totalBuildings: buildings,
      totalAlerts: alerts,
      energyScore: calculateEnergyScore({ units, budget, cost, activeDevices, totalDevices: devices }),
      monthlyCo2Kg: Number((units * (setting?.organization?.carbonFactorKgPerKwh || 0.82)).toFixed(2))
    },
    charts: {
      dailyConsumption: daily.map((item) => ({ label: item._id, units: item.units, cost: item.cost })),
      deviceDistribution: distribution.map((item) => ({ name: item._id, value: item.value })),
      peakUsageHours: peak.map((item) => ({ hour: `${item._id}:00`, units: item.units }))
    }
  };
};
