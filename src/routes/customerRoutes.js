// src/routes/customerRoutes.js
import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/customercontroller.js';

import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',authenticate,  createCustomer);
router.get('/', authenticate, getCustomers);
router.get('/:id',authenticate,  getCustomerById);
router.put('/:id',authenticate,  updateCustomer);
router.delete('/:id',authenticate, deleteCustomer);

export default router;
