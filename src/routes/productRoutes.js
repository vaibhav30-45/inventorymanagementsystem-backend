const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllProducts);

module.exports = router;
