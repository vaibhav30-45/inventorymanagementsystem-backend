import express from 'express';

import { getAllSales } from '../controllers/salescontroller.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getAllSales);

export default router;