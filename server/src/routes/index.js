import { Router } from 'express';
import authRoutes from './auth.routes.js';
import { dashboardSummary } from '../controllers/dashboard.controller.js';
import { generateBilling } from '../controllers/billing.controller.js';
import { ingestEnergyLog, updateDeviceStatus } from '../controllers/realtime.controller.js';
import {
  alertController,
  auditLogController,
  billController,
  buildingController,
  deviceController,
  energyLogController,
  floorController,
  notificationController,
  organizationController,
  roomController,
  settingController,
  userController
} from '../controllers/domain.controllers.js';
import { authorize, organizationScope, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { buildCrudRouter } from './crud.routes.js';
import {
  billingRules,
  buildingRules,
  deviceRules,
  energyLogRules,
  floorRules,
  organizationRules,
  roomRules
} from '../validators/domain.validator.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ success: true, service: 'VoltView API' }));
router.use('/auth', authRoutes);
router.get('/dashboard/summary', protect, dashboardSummary);
router.post('/billing/generate', protect, authorize('super_admin', 'admin', 'user'), billingRules, validate, generateBilling);
router.post('/energy-logs/ingest', protect, organizationScope, energyLogRules, validate, ingestEnergyLog);
router.patch('/devices/:id/status', protect, authorize('super_admin', 'admin', 'manager'), updateDeviceStatus);

router.use('/organizations', buildCrudRouter({ controller: organizationController, roles: ['super_admin'], createRules: organizationRules }));
router.use('/users', buildCrudRouter({ controller: userController, roles: ['super_admin', 'admin'] }));
router.use('/buildings', buildCrudRouter({ controller: buildingController, roles: ['super_admin', 'admin'], createRules: buildingRules }));
router.use('/floors', buildCrudRouter({ controller: floorController, roles: ['super_admin', 'admin', 'manager'], createRules: floorRules }));
router.use('/rooms', buildCrudRouter({ controller: roomController, roles: ['super_admin', 'admin', 'manager'], createRules: roomRules }));
router.use('/devices', buildCrudRouter({ controller: deviceController, roles: ['super_admin', 'admin', 'user'], createRules: deviceRules }));
router.use('/energy-logs', buildCrudRouter({ controller: energyLogController, roles: ['super_admin', 'admin', 'user'], createRules: energyLogRules }));
router.use('/bills', buildCrudRouter({ controller: billController, roles: ['super_admin', 'admin', 'user'] }));
router.use('/alerts', buildCrudRouter({ controller: alertController, roles: ['super_admin', 'admin', 'manager'] }));
router.use('/notifications', buildCrudRouter({ controller: notificationController, roles: ['super_admin', 'admin', 'manager', 'user'] }));
router.use('/audit-logs', buildCrudRouter({ controller: auditLogController, roles: ['super_admin', 'admin'] }));
router.use('/settings', buildCrudRouter({ controller: settingController, roles: ['super_admin', 'admin'] }));

export default router;
