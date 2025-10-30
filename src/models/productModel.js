const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchasingPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  stock: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);
