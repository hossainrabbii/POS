import { z } from "zod";

// ======================================================
// SHOP SETTINGS
// ======================================================

export const createShopValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Shop name must be at least 2 characters")
      .max(100, "Shop name cannot exceed 100 characters"),

    logo: z
      .string()
      .trim()
      .max(500, "Logo URL cannot exceed 500 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .max(20, "Phone number cannot exceed 20 characters")
      .optional(),

    alternativePhone: z
      .string()
      .trim()
      .max(20, "Alternative phone number cannot exceed 20 characters")
      .optional(),

    email: z.string().trim().email("Invalid email address").optional(),

    address: z
      .string()
      .trim()
      .max(300, "Address cannot exceed 300 characters")
      .optional(),

    city: z
      .string()
      .trim()
      .max(100, "City cannot exceed 100 characters")
      .optional(),

    website: z.string().trim().url("Invalid website URL").optional(),

    receiptFooter: z
      .string()
      .trim()
      .max(200, "Receipt footer cannot exceed 200 characters")
      .optional(),
  }),
});

// ======================================================
// UPDATE SHOP SETTINGS
// ======================================================

export const updateShopValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Shop name must be at least 2 characters")
      .max(100, "Shop name cannot exceed 100 characters")
      .optional(),

    logo: z
      .string()
      .trim()
      .max(500, "Logo URL cannot exceed 500 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .max(20, "Phone number cannot exceed 20 characters")
      .optional(),

    alternativePhone: z
      .string()
      .trim()
      .max(20, "Alternative phone number cannot exceed 20 characters")
      .optional(),

    email: z.string().trim().email("Invalid email address").optional(),

    address: z
      .string()
      .trim()
      .max(300, "Address cannot exceed 300 characters")
      .optional(),

    city: z
      .string()
      .trim()
      .max(100, "City cannot exceed 100 characters")
      .optional(),

    website: z.string().trim().url("Invalid website URL").optional(),

    receiptFooter: z
      .string()
      .trim()
      .max(200, "Receipt footer cannot exceed 200 characters")
      .optional(),
  }),
});
