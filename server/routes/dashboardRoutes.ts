import { Router } from 'express';
import {
  getLandlordDashboard,
  getTenantDashboard,
} from '../controllers/dashboardController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/landlord', requireRole('landlord'), getLandlordDashboard);
router.get('/tenant', getTenantDashboard);

export default router;
