import mongoose from "mongoose";

import { Category } from "../category/category.model.js";

import { Product } from "./product.model.js";

import type {
  ICreateProduct,
  IUpdateProduct,
} from "./product.interface.js";


// ======================================================
// GENERATE SKU
// ======================================================

const generateSku = (
  productName: string
): string => {
  const prefix = productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase();

  const randomPart =
    Date.now().toString().slice(-6);

  return `${prefix}-${randomPart}`;
};


// ======================================================
// CREATE PRODUCT
// ======================================================

export const createProduct = async (
  payload: ICreateProduct
) => {

  // ----------------------------------------------------
  // Check category ID format
  // ----------------------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      payload.categoryId
    )
  ) {
    throw new Error(
      "Invalid category ID"
    );
  }


  // ----------------------------------------------------
  // Check category exists and is active
  // ----------------------------------------------------

  const category =
    await Category.findOne({
      _id: payload.categoryId,
      isActive: true,
    });

  if (!category) {
    throw new Error(
      "Category not found or inactive"
    );
  }


  // ----------------------------------------------------
  // Prevent duplicate active product names
  // ----------------------------------------------------

  const existingProduct =
    await Product.findOne({
      name: payload.name,
      isActive: true,
    });

  if (existingProduct) {
    throw new Error(
      "A product with this name already exists"
    );
  }


  // ----------------------------------------------------
  // Generate unique SKU
  // ----------------------------------------------------

  let sku = generateSku(
    payload.name
  );

  let skuExists =
    await Product.findOne({
      sku,
    });

  while (skuExists) {
    sku = generateSku(
      payload.name
    );

    skuExists =
      await Product.findOne({
        sku,
      });
  }


  // ----------------------------------------------------
  // Create product
  // ----------------------------------------------------

  const product =
    await Product.create({
      name: payload.name,

      categoryId:
        new mongoose.Types.ObjectId(
          payload.categoryId
        ),

      purchasePrice:
        payload.purchasePrice,

      sellingPrice:
        payload.sellingPrice,

      quantity:
        payload.quantity,

      lowStockThreshold:
        payload.lowStockThreshold ?? 5,

      description:
        payload.description,

      image:
        payload.image,

      sku,

      isActive: true,
    });


  // ----------------------------------------------------
  // Return product with category
  // ----------------------------------------------------

  return product.populate({
    path: "categoryId",
    select: "name isActive",
  });
};


// ======================================================
// GET ALL PRODUCTS
// ======================================================

export const getAllProducts =
  async () => {

    const products =
      await Product.find({
        isActive: true,
      })
        .populate({
          path: "categoryId",
          select: "name isActive",
        })
        .sort({
          createdAt: -1,
        });

    return products;
  };


// ======================================================
// GET SINGLE PRODUCT
// ======================================================

export const getProductById =
  async (
    productId: string
  ) => {

    // ----------------------------------------------------
    // Check product ID format
    // ----------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      throw new Error(
        "Invalid product ID"
      );
    }


    // ----------------------------------------------------
    // Find product
    // ----------------------------------------------------

    const product =
      await Product.findOne({
        _id: productId,
        isActive: true,
      }).populate({
        path: "categoryId",
        select: "name isActive",
      });


    if (!product) {
      throw new Error(
        "Product not found"
      );
    }


    return product;
  };


// ======================================================
// UPDATE PRODUCT
// ======================================================

export const updateProduct =
  async (
    productId: string,
    payload: IUpdateProduct
  ) => {

    // ----------------------------------------------------
    // Check product ID format
    // ----------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      throw new Error(
        "Invalid product ID"
      );
    }


    // ----------------------------------------------------
    // Prevent duplicate product names
    // ----------------------------------------------------

    if (payload.name) {

      const existingProduct =
        await Product.findOne({
          name: payload.name,
          isActive: true,

          _id: {
            $ne: productId,
          },
        });


      if (existingProduct) {
        throw new Error(
          "A product with this name already exists"
        );
      }
    }


    // ----------------------------------------------------
    // Check category if category is being changed
    // ----------------------------------------------------

    if (payload.categoryId) {

      if (
        !mongoose.Types.ObjectId.isValid(
          payload.categoryId
        )
      ) {
        throw new Error(
          "Invalid category ID"
        );
      }


      const category =
        await Category.findOne({
          _id: payload.categoryId,
          isActive: true,
        });


      if (!category) {
        throw new Error(
          "Category not found or inactive"
        );
      }
    }


    // ----------------------------------------------------
    // Prepare update data
    // ----------------------------------------------------

    const updateData: Record<
      string,
      unknown
    > = {
      ...payload,
    };


    // Convert category ID string
    // into MongoDB ObjectId

    if (payload.categoryId) {
      updateData.categoryId =
        new mongoose.Types.ObjectId(
          payload.categoryId
        );
    }


    // ----------------------------------------------------
    // Update product
    // ----------------------------------------------------

    const product =
      await Product.findOneAndUpdate(
        {
          _id: productId,
          isActive: true,
        },

        updateData,

        {
          new: true,
          runValidators: true,
        }
      ).populate({
        path: "categoryId",
        select: "name isActive",
      });


    if (!product) {
      throw new Error(
        "Product not found"
      );
    }


    return product;
  };


// ======================================================
// DEACTIVATE PRODUCT
// ======================================================

export const deleteProduct =
  async (
    productId: string
  ) => {

    // ----------------------------------------------------
    // Check product ID format
    // ----------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      throw new Error(
        "Invalid product ID"
      );
    }


    // ----------------------------------------------------
    // Deactivate product
    // ----------------------------------------------------

    const product =
      await Product.findOneAndUpdate(
        {
          _id: productId,
          isActive: true,
        },

        {
          isActive: false,
        },

        {
          new: true,
          runValidators: true,
        }
      );


    if (!product) {
      throw new Error(
        "Product not found"
      );
    }


    return product;
  };