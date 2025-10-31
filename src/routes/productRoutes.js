import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Superadmin can add/update/delete
router.post("/", protect, authorizeRoles("superadmin"), addProduct);
router.put("/:id", protect, authorizeRoles("superadmin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteProduct);

// Everyone (admin + superadmin) can view products
router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);

export default router;
