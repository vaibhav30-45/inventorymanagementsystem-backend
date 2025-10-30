import Product from "../models/productModel.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, category, purchasePrice, sellingPrice, discount, quantity, description } = req.body;

    const newProduct = await Product.create({
      name,
      category,
      purchasePrice,
      sellingPrice,
      discount,
      quantity,
      description,
    });

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Hide purchase price if user is not Super Admin
    const filtered = products.map((p) => {
      const data = p.toObject();
      if (req.user.role !== "superadmin") {
        delete data.purchasePrice;
      }
      return data;
    });

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const data = product.toObject();
    if (req.user.role !== "SuperAdmin") {
      delete data.purchasePrice;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", product: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
