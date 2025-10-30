// src/routes/customerRoutes.js
import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/customercontroller.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',protect,  createCustomer);
router.get('/', protect, getCustomers);
router.get('/:id',protect,  getCustomerById);
router.put('/:id',protect,  updateCustomer);
router.delete('/:id',protect, deleteCustomer);

export default router;
