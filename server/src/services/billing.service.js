import { Bill } from '../models/Bill.js';
import { EnergyLog } from '../models/EnergyLog.js';
import { Setting } from '../models/Setting.js';

export const calculateSlabBill = (units, rules) => {
  let remaining = units;
  let total = 0;
  const breakdown = [];

  for (const rule of rules) {
    if (remaining <= 0) break;
    const upper = rule.to ?? Number.POSITIVE_INFINITY;
    const slabSize = upper === Number.POSITIVE_INFINITY ? remaining : Math.max(upper - rule.from + 1, 0);
    const billableUnits = Math.min(remaining, slabSize);
    const amount = billableUnits * rule.rate;

    if (billableUnits > 0) {
      breakdown.push({ label: `${rule.from}-${rule.to ?? 'above'}`, units: billableUnits, rate: rule.rate, amount });
      total += amount;
      remaining -= billableUnits;
    }
  }

  return { amount: total, breakdown };
};

import mongoose from 'mongoose';

export const generateBill = async ({ organization, building, room, device, periodStart, periodEnd }) => {
  const setting = await Setting.findOne({ organization });
  const match = {
    organization: new mongoose.Types.ObjectId(String(organization)),
    timestamp: { $gte: new Date(periodStart), $lte: new Date(periodEnd) }
  };
  if (building) match.building = building;
  if (room) match.room = room;
  if (device) match.device = device;

  const result = await EnergyLog.aggregate([
    { $match: match },
    { $group: { _id: null, units: { $sum: '$unitsConsumed' } } }
  ]);
  const units = result[0]?.units || 0;
  const billingType = setting?.billingType || 'flat';

  let calculated;
  if (billingType === 'flat') {
    const rate = setting?.electricityRate || 7;
    calculated = { amount: units * rate, breakdown: [{ label: 'Flat rate', units, rate, amount: units * rate }] };
  } else {
    calculated = calculateSlabBill(units, setting?.tariffRules || []);
  }

  return Bill.create({
    organization,
    building,
    room,
    device,
    periodStart,
    periodEnd,
    billingType,
    units,
    amount: calculated.amount,
    breakdown: calculated.breakdown
  });
};
