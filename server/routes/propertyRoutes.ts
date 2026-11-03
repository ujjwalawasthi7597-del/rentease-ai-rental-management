import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', requireRole('landlord'), createProperty);
router.put('/:id', requireRole('landlord'), updateProperty);
router.delete('/:id', requireRole('landlord'), deleteProperty);

export default router;
