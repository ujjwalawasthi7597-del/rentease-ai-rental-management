import { Router } from 'express';
import {
  getMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
} from '../controllers/maintenanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getMaintenanceRequests);
router.get('/:id', getMaintenanceRequestById);
router.post('/', createMaintenanceRequest);
router.put('/:id', updateMaintenanceRequest);

export default router;
