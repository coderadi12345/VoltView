import { getDashboardSummary } from '../services/analytics.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dashboardSummary = asyncHandler(async (req, res) => {
  const organization = req.user.role === 'super_admin' ? req.query.organization : req.user.organization;
  const data = await getDashboardSummary(organization);
  res.json({ success: true, data });
});
