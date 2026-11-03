import { Router } from 'express';
import {
  getTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getTenants);
router.get('/:id', getTenantById);
router.post('/', requireRole('landlord'), createTenant);
router.put('/:id', requireRole('landlord'), updateTenant);
router.delete('/:id', requireRole('landlord'), deleteTenant);

export default router;
