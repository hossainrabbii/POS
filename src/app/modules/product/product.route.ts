import { Router } from "express";

import authMiddleware from "../../middlewares/authMiddleware.js";

import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "./product.controller.js";

const router = Router();

// ======================================================
// ALL PRODUCT ROUTES REQUIRE VALID ACCESS TOKEN
// ======================================================

router.use(authMiddleware);

// ======================================================
// CREATE
// ======================================================

router.post("/", createProductController);

// ======================================================
// GET ALL
// ======================================================

router.get("/", getAllProductsController);

// ======================================================
// GET SINGLE
// ======================================================

router.get("/:id", getProductByIdController);

// ======================================================
// UPDATE
// ======================================================

router.patch("/:id", updateProductController);

// ======================================================
// DELETE / DEACTIVATE
// ======================================================

router.delete("/:id", deleteProductController);

export default router;
