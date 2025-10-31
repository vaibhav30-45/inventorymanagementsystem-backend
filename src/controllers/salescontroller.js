import Sales from '../models/salesModel.js';

export const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
};
