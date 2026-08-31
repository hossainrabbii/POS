import { z } from "zod";

export const createProductValidation = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name cannot exceed 100 characters"),

    categoryId: z.string().min(1, "Category is required"),

    purchasePrice: z.number().min(0, "Purchase price cannot be negative"),

    sellingPrice: z.number().min(0, "Selling price cannot be negative"),

    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .min(0, "Quantity cannot be negative"),

    lowStockThreshold: z
      .number()
      .int("Low stock threshold must be a whole number")
      .min(0, "Low stock threshold cannot be negative")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    image: z.string().trim().optional(),
  })
  .refine((data) => data.sellingPrice >= data.purchasePrice, {
    message: "Selling price cannot be lower than purchase price",
    path: ["sellingPrice"],
  });

export const updateProductValidation = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  categoryId: z.string().min(1).optional(),
  purchasePrice: z.number().min(0).optional(),
  sellingPrice: z.number().min(0).optional(),
  quantity: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  description: z.string().trim().max(500).optional(),
  image: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});
