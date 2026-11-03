import { Router } from 'express';
import {
  getAgreements,
  createAgreement,
  deleteAgreement,
} from '../controllers/agreementController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAgreements);
router.post('/', requireRole('landlord'), createAgreement);
router.delete('/:id', requireRole('landlord'), deleteAgreement);

export default router;
