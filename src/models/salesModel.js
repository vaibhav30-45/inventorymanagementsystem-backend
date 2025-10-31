import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  customerName: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, required: true },
  saleType: { type: String, enum: ['Regular', 'Manual'], required: true },
  notes: String,
});

export default mongoose.model("Sales", saleSchema);
