const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');  
const { getProducts, createProduct } = require('../controllers/productController');

router.get('/', protect, getProducts);
router.post('/', protect, createProduct);

module.exports = router;

