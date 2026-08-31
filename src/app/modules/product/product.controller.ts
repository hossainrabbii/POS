import type { Request, Response } from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./product.service.js";

import {
  createProductValidation,
  updateProductValidation,
} from "./product.validation.js";

// ======================================================
// CREATE
// ======================================================

export const createProductController = async (req: Request, res: Response) => {
  const data = createProductValidation.parse(req.body);
  const product = await createProduct(data);
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

// ======================================================
// GET ALL
// ======================================================

export const getAllProductsController = async (req: Request, res: Response) => {
  const products = await getAllProducts();

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: products,
  });
};

// ======================================================
// GET SINGLE
// ======================================================

export const getProductByIdController = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: product,
  });
};

// ======================================================
// UPDATE
// ======================================================

export const updateProductController = async (req: Request, res: Response) => {
  const data = updateProductValidation.parse(req.body);

  const product = await updateProduct(req.params.id as string, data);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

// ======================================================
// DELETE / DEACTIVATE
// ======================================================

export const deleteProductController = async (req: Request, res: Response) => {
  await deleteProduct(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Product deactivated successfully",
  });
};
