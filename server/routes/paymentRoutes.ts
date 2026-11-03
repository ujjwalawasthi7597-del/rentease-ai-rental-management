import { Router } from 'express';
import {
  getPayments,
  createPayment,
  updatePayment,
  getPaymentHistory,
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getPayments);
router.get('/history', getPaymentHistory);
router.post('/', createPayment);
router.put('/:id', updatePayment);

export default router;
