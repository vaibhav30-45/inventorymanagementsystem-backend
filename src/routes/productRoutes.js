import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Superadmin can add/update/delete
router.post("/", authenticate, authorizeRoles("superadmin"), addProduct);
router.put("/:id", authenticate, authorizeRoles("superadmin"), updateProduct);
router.delete("/:id", authenticate, authorizeRoles("superadmin"), deleteProduct);

// Everyone (admin + superadmin) can view products
router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);

export default router;
