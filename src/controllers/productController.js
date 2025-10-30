const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  try {
    const role = req.user.role;
    let products;

    if (role === 'superadmin') {
      products = await Product.find({}, 'name purchasingPrice sellingPrice stock');
    } else {
      products = await Product.find({}, 'name sellingPrice stock');
    }

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
