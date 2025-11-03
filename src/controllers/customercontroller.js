import { RegularCustomer, ManualCustomer } from '../models/customerModel.js';
import Sales from '../models/salesModel.js';
import Product from '../models/productModel.js';

const getModelByType = (type) => {
  if (type === 'Regular') return RegularCustomer;
  if (type === 'Manual') return ManualCustomer;
  throw new Error('Invalid customer type');
};

const calculateDiscountedPrice = (sellingPrice, discountPercent) => {
  return sellingPrice * (1 - discountPercent / 100);
};

const calculateTotalAmount = (products) => {
  return products.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
};

export const createCustomer = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type || !['Regular', 'Manual'].includes(type)) {
      return res.status(400).json({ message: 'Invalid customer type' });
    }

    let customerData = { type };

    if (type === 'Regular') {
      const { name, contactNumber, address, purchaseHistory, creditStatus } = req.body;
      if (!name || !address) {
        return res.status(400).json({ message: 'Name and Address required for Regular customers' });
      }

      for (const purchase of purchaseHistory) {
        if (!purchase.products || purchase.products.length === 0) {
          return res.status(400).json({ message: 'Purchase must have products' });
        }
        const productIds = purchase.products.map(p => p.productId);
        const productsFromDB = await Product.find({ _id: { $in: productIds } });
        const productDetailsMap = new Map();
        productsFromDB.forEach(p => productDetailsMap.set(p._id.toString(), p));

        // Attach price and quantity 
        purchase.products = purchase.products.map(prod => {
          const details = productDetailsMap.get(prod.productId.toString());
          if (!details) throw new Error(`Product not found: ${prod.productId}`);
          const discountedPrice = calculateDiscountedPrice(details.sellingPrice, details.discount);
          return {
            productId: prod.productId,
            quantity: prod.quantity || 1,
            price: discountedPrice,
          };
        });

     
        purchase.totalAmount = calculateTotalAmount(purchase.products);
      }

      customerData = {
        name,
        contactNumber,
        address,
        purchaseHistory,
        creditStatus: creditStatus || 'Paid',
      };

    } else if (type === 'Manual') {
      const { oneTimeTransaction, basicDetails } = req.body;
      if (!oneTimeTransaction) {
        return res.status(400).json({ message: 'Transaction record required for Manual entry' });
      }

      const productIds = oneTimeTransaction.products.map(p => p.productId);
      const productsFromDB = await Product.find({ _id: { $in: productIds } });
      const productDetailsMap = new Map();
      productsFromDB.forEach(p => productDetailsMap.set(p._id.toString(), p));

      oneTimeTransaction.products = oneTimeTransaction.products.map(prod => {
        const details = productDetailsMap.get(prod.productId.toString());
        if (!details) throw new Error(`Product not found: ${prod.productId}`);
        const discountedPrice = calculateDiscountedPrice(details.sellingPrice, details.discount);
        return {
          productId: prod.productId,
          quantity: prod.quantity || 1,
          price: discountedPrice,
        };
      });

      oneTimeTransaction.totalAmount = calculateTotalAmount(oneTimeTransaction.products);

      customerData = {
        basicDetails: {
          name: basicDetails?.name || '',
          contactNumber: basicDetails?.contactNumber || '',
        },
        oneTimeTransaction,
      };
    }

    const Model = getModelByType(type);
    const customer = new Model(customerData);
    await customer.save();

    if (type === 'Regular') {
      for (const purchase of customer.purchaseHistory) {
        const sale = new Sales({
          customerId: customer._id,
          customerName: customer.name,
          products: purchase.products,
          totalAmount: purchase.totalAmount,
          date: purchase.date,
          paymentMethod: purchase.paymentMethod,
          saleType: 'Regular',
        });
        await sale.save();
      }
    } else if (type === 'Manual') {
      const purchase = customer.oneTimeTransaction;
      const sale = new Sales({
        customerId: customer._id,
        customerName: customer.basicDetails?.name,
        products: purchase.products,
        totalAmount: purchase.totalAmount,
        date: purchase.date,
        paymentMethod: purchase.paymentMethod,
        saleType: 'Manual',
      });
      await sale.save();
    }

    res.status(201).json({ message: 'Customer and Sales Entry created', customer });

  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
};


export const getCustomers = async (req, res) => {
  try {
   
    const regularCustomers = await RegularCustomer.find();
    const manualCustomers = await ManualCustomer.find();
    const customers = [...regularCustomers, ...manualCustomers];
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
   
    let customer = await RegularCustomer.findById(req.params.id);
    if (!customer) {
      customer = await ManualCustomer.findById(req.params.id);
    }
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
   
    let updated = await RegularCustomer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      updated = await ManualCustomer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    }
    if (!updated) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer updated', customer: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
 
    let deleted = await RegularCustomer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      deleted = await ManualCustomer.findByIdAndDelete(req.params.id);
    }
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted', customer: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};
