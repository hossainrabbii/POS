import {
  z,
} from "zod";


// ======================================================
// CUSTOMER VALIDATION
// ======================================================

const customerSchema =
  z.object({

    name: z
      .string()
      .trim()
      .min(
        2,
        "Customer name must be at least 2 characters"
      )
      .max(
        100,
        "Customer name cannot exceed 100 characters"
      ),

    phone: z
      .string()
      .trim()
      .max(
        30,
        "Phone number cannot exceed 30 characters"
      )
      .optional(),

    address: z
      .string()
      .trim()
      .max(
        300,
        "Address cannot exceed 300 characters"
      )
      .optional(),

  });


// ======================================================
// SALE ITEM VALIDATION
// ======================================================

const saleItemSchema =
  z.object({

    productId: z
      .string()
      .min(
        1,
        "Product ID is required"
      ),

    quantity: z
      .number()
      .int()
      .min(
        1,
        "Quantity must be at least 1"
      ),

    warrantyMonths: z
      .number()
      .min(
        0,
        "Warranty cannot be negative"
      )
      .optional(),

  });


// ======================================================
// CREATE SALE VALIDATION
// ======================================================

export const createSaleValidation =
  z.object({

    customer:
      customerSchema,

    items:
      z
        .array(saleItemSchema)
        .min(
          1,
          "At least one product is required"
        ),

    discount:
      z
        .number()
        .min(
          0,
          "Discount cannot be negative"
        )
        .optional(),

    paidAmount:
      z
        .number()
        .min(
          0,
          "Paid amount cannot be negative"
        ),

    dueCommitmentMonths:
      z
        .number()
        .min(
          0,
          "Due commitment cannot be negative"
        )
        .optional(),

  });


// ======================================================
// ADD PAYMENT VALIDATION
// ======================================================

export const addSalePaymentValidation =
  z.object({

    amount:
      z
        .number()
        .positive(
          "Payment amount must be greater than 0"
        ),

  });