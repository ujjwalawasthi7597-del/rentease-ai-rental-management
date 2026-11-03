import { Router } from 'express';
import {
  analyzeAgreement,
  categorizeMaintenance,
  generateReminder,
  getExpenseSummary,
} from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/analyze-agreement', analyzeAgreement);
router.post('/categorize-maintenance', categorizeMaintenance);
router.post('/generate-reminder', generateReminder);
router.post('/expense-summary', getExpenseSummary);

export default router;
