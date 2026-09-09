import { Router } from "express";

import authMiddleware from "../../middlewares/authMiddleware.js";

import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./category.controller.js";

const router = Router();

// ======================================================
// ALL PRODUCT ROUTES REQUIRE VALID ACCESS TOKEN
// ======================================================

router.use(authMiddleware);

// CREATE
router.post("/", createCategoryController);

// GET ALL
router.get("/", getAllCategoriesController);

// GET ONE
router.get("/:id", getCategoryByIdController);

// UPDATE
router.patch("/:id", updateCategoryController);

// DELETE / DEACTIVATE
router.delete("/:id", deleteCategoryController);

export default router;
