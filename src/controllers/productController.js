const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
  try {
    console.log("User Role:", req.user.role);
    const role = req.user.role;
    let products = await Product.find();

    if (role === 'admin') {
      products = products.map(p => ({
        name: p.name,
        sellingPrice: p.sellingPrice,
        quantity: p.quantity,
      }));
    } else if (role === 'superadmin') {
      products = products.map(p => ({
        name: p.name,
        purchasingPrice: p.purchasingPrice,
        sellingPrice: p.sellingPrice,
        quantity: p.quantity,
      }));
    }

    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, purchasingPrice, sellingPrice, quantity } = req.body;
    const newProduct = new Product({ name, purchasingPrice, sellingPrice, quantity });
    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
