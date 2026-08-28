import type {
    Request,
    Response,
  } from "express";
  
  import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
  } from "./category.service.js";
  
  import {
    createCategoryValidation,
    updateCategoryValidation,
  } from "./category.validation.js";
  
  
  // ======================================================
  // CREATE
  // ======================================================
  
  export const createCategoryController =
    async (
      req: Request,
      res: Response
    ) => {
      const data =
        createCategoryValidation.parse(
          req.body
        );
  
      const category =
        await createCategory(
          data
        );
  
      res.status(201).json({
        success: true,
  
        message:
          "Category created successfully",
  
        data: category,
      });
    };
  
  
  // ======================================================
  // GET ALL
  // ======================================================
  
  export const getAllCategoriesController =
    async (
      req: Request,
      res: Response
    ) => {
      const categories =
        await getAllCategories();
  
      res.status(200).json({
        success: true,
  
        message:
          "Categories retrieved successfully",
  
        data: categories,
      });
    };
  
  
  // ======================================================
  // GET SINGLE
  // ======================================================
  
  export const getCategoryByIdController =
    async (
      req: Request,
      res: Response
    ) => {
      const category =
        await getCategoryById(
          req.params.id as string
        );
  
      res.status(200).json({
        success: true,
  
        message:
          "Category retrieved successfully",
  
        data: category,
      });
    };
  
  
  // ======================================================
  // UPDATE
  // ======================================================
  
  export const updateCategoryController =
    async (
      req: Request,
      res: Response
    ) => {
      const data =
        updateCategoryValidation.parse(
          req.body
        );
  
      const category =
        await updateCategory(
          req.params.id as string,
          data
        );
  
      res.status(200).json({
        success: true,
  
        message:
          "Category updated successfully",
  
        data: category,
      });
    };
  
  
  // ======================================================
  // DELETE
  // ======================================================
  
  export const deleteCategoryController =
    async (
      req: Request,
      res: Response
    ) => {
      await deleteCategory(
        req.params.id as string
      );
  
      res.status(200).json({
        success: true,
  
        message:
          "Category deactivated successfully",
      });
    };