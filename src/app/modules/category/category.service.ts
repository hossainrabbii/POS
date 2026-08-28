import { Category } from "./category.model.js";

import type {
  ICreateCategory,
  IUpdateCategory,
} from "./category.interface.js";


// ======================================================
// CREATE CATEGORY
// ======================================================

export const createCategory = async (
  payload: ICreateCategory
) => {
  const existingCategory =
    await Category.findOne({
      name: payload.name,
    });

  if (existingCategory) {
    throw new Error(
      "Category already exists"
    );
  }

  const category =
    await Category.create({
      name: payload.name,
      description:
        payload.description,
    });

  return category;
};


// ======================================================
// GET ALL CATEGORIES
// ======================================================

export const getAllCategories =
  async () => {
    const categories =
      await Category.find()
        .sort({
          name: 1,
        });

    return categories;
  };


// ======================================================
// GET SINGLE CATEGORY
// ======================================================

export const getCategoryById =
  async (
    categoryId: string
  ) => {
    const category =
      await Category.findById(
        categoryId
      );

    if (!category) {
      throw new Error(
        "Category not found"
      );
    }

    return category;
  };


// ======================================================
// UPDATE CATEGORY
// ======================================================

export const updateCategory =
  async (
    categoryId: string,
    payload: IUpdateCategory
  ) => {
    if (payload.name) {
      const existingCategory =
        await Category.findOne({
          name: payload.name,

          _id: {
            $ne: categoryId,
          },
        });

      if (existingCategory) {
        throw new Error(
          "Category already exists"
        );
      }
    }

    const category =
      await Category.findByIdAndUpdate(
        categoryId,

        payload,

        {
          new: true,
          runValidators: true,
        }
      );

    if (!category) {
      throw new Error(
        "Category not found"
      );
    }

    return category;
  };


// ======================================================
// DELETE / DEACTIVATE CATEGORY
// ======================================================

export const deleteCategory =
  async (
    categoryId: string
  ) => {
    const category =
      await Category.findById(
        categoryId
      );

    if (!category) {
      throw new Error(
        "Category not found"
      );
    }

    category.isActive = false;

    await category.save();

    return category;
  };