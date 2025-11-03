import mongoose from 'mongoose';

const purchaseProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },   
  price: { type: Number, required: true },  
});

const purchaseSchema = new mongoose.Schema({
  products: [purchaseProductSchema],       
  totalAmount: Number,
  date: Date,
  paymentMethod: String,
});

const regularCustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: String,
  address: { type: String, required: true },
  purchaseHistory: [purchaseSchema],
  creditStatus: { type: String, enum: ['Paid', 'Due', 'Partial'] },
  createdAt: { type: Date, default: Date.now },
});

const manualCustomerSchema = new mongoose.Schema({
  basicDetails: {
    name: String,
    contactNumber: String,
  },
  oneTimeTransaction: purchaseSchema,
  createdAt: { type: Date, default: Date.now },
});

const RegularCustomer = mongoose.model('RegularCustomer', regularCustomerSchema, 'regularCustomers');
const ManualCustomer = mongoose.model('ManualCustomer', manualCustomerSchema, 'manualCustomers');

export { RegularCustomer, ManualCustomer };
