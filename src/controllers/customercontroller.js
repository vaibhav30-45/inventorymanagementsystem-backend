import { RegularCustomer, ManualCustomer } from '../models/customerModel.js';
import Sales from '../models/salesModel.js';

const getModelByType = (type) => {
  if (type === 'Regular') return RegularCustomer;
  if (type === 'Manual') return ManualCustomer;
  throw new Error('Invalid customer type');
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
      customerData = {
        name,
        contactNumber,
        address,
        purchaseHistory: purchaseHistory || [],
        creditStatus: creditStatus || 'Paid',
      };
    } else if (type === 'Manual') {
  const { oneTimeTransaction, basicDetails } = req.body;
  if (!oneTimeTransaction) {
    return res.status(400).json({ message: 'Transaction record required for Manual entry' });
  }
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
