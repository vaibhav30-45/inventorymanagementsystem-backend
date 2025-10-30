import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Product routes (protected)
router.post("/", authenticate, addProduct);
router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
