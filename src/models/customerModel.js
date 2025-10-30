

import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
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
});

const manualCustomerSchema = new mongoose.Schema({
  basicDetails: {
    name: String,
    contactNumber: String,
  },
  oneTimeTransaction: purchaseSchema,
});

const RegularCustomer = mongoose.model('RegularCustomer', regularCustomerSchema, 'regularCustomers');
const ManualCustomer = mongoose.model('ManualCustomer', manualCustomerSchema, 'manualCustomers');

export { RegularCustomer, ManualCustomer };
