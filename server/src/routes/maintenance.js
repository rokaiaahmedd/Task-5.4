import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest
} from '../controllers/maintenanceController.js';

import { rateLimit } from 'express-rate-limit';
import { doubleCsrfProtection } from '../middleware/csrf.js';
// Rate limiter
const maintenanceLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.'
  }
});

const router = Router();

// Apply rate limiting to all maintenance requests
router.use(maintenanceLimiter);

// Public routes
router.get('/', getAllRequests);
router.get('/:id', getRequest);

// Protected routes
router.post('/', requireAuth, doubleCsrfProtection, createRequest);
router.patch('/:id', requireAuth, doubleCsrfProtection, updateRequest);
router.delete('/:id', requireAuth, doubleCsrfProtection, deleteRequest);

export default router;