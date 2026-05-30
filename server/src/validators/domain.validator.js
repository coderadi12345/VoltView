import { body, param } from 'express-validator';

export const mongoIdParam = [param('id').isMongoId()];

export const organizationRules = [
  body('name').trim().notEmpty(),
  body('slug').trim().notEmpty().matches(/^[a-z0-9-]+$/)
];

export const buildingRules = [body('name').trim().notEmpty(), body('organization').isMongoId()];

export const floorRules = [
  body('name').trim().notEmpty(),
  body('number').isNumeric(),
  body('organization').isMongoId(),
  body('building').isMongoId()
];

export const roomRules = [
  body('name').trim().notEmpty(),
  body('organization').isMongoId(),
  body('building').isMongoId(),
  body('floor').isMongoId()
];

export const deviceRules = [
  body('name').trim().notEmpty(),
  body('wattage').isNumeric(),
  body('organization').isMongoId(),
  body('building').trim().notEmpty(),
  body('room').trim().notEmpty()
];

export const energyLogRules = [
  body('device').isMongoId(),
  body('building').isMongoId(),
  body('room').isMongoId(),
  body('unitsConsumed').isNumeric()
];

export const billingRules = [
  body('periodStart').isISO8601(),
  body('periodEnd').isISO8601(),
  body('organization').optional().isMongoId()
];

