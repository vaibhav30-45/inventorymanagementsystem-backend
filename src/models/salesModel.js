import mongoose from 'mongoose';

const saleProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, required: true },
  price: { type: Number, required: true }  // unit price after discount
});

const saleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  customerName: { type: String, required: true },
  products: [saleProductSchema], 
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, required: true },
  saleType: { type: String, enum: ['Regular', 'Manual'], required: true },
  notes: String,
});


export default mongoose.model("Sales", saleSchema);
