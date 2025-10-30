import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Hardware", "Pesticide"], 
    required: true 
  },
  purchasePrice: { type: Number, required: true }, 
  sellingPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // percentage
  quantity: { type: Number, default: 0 },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
