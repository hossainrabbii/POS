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


// ======================================================
// GET ALL SALES QUERY VALIDATION
// ======================================================

export const getAllSalesValidation =
  z.object({

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    page:
      z.coerce
        .number()
        .int()
        .min(
          1,
          "Page must be at least 1"
        )
        .default(1),

    limit:
      z.coerce
        .number()
        .int()
        .min(
          1,
          "Limit must be at least 1"
        )
        .max(
          100,
          "Limit cannot exceed 100"
        )
        .default(20),


    // --------------------------------------------------
    // Search
    // --------------------------------------------------

    search:
      z
        .string()
        .trim()
        .optional(),


    // --------------------------------------------------
    // Payment Status
    // --------------------------------------------------

    paymentStatus:
      z
        .enum([
          "PAID",
          "DUE",
        ])
        .optional(),


    // --------------------------------------------------
    // Seller
    // --------------------------------------------------

    soldBy:
      z
        .string()
        .trim()
        .optional(),


    // --------------------------------------------------
    // Date Range
    // --------------------------------------------------

    from:
      z
        .string()
        .trim()
        .optional(),

    to:
      z
        .string()
        .trim()
        .optional(),

  });


// ======================================================
// SALES STATISTICS QUERY VALIDATION
// ======================================================

export const getSalesStatisticsValidation =
  z
    .object({

      // ------------------------------------------------
      // Statistics period
      // ------------------------------------------------

      period:
        z
          .enum([
            "today",
            "week",
            "month",
            "custom",
          ])
          .optional(),

      // ------------------------------------------------
      // Custom date range
      // ------------------------------------------------

      from:
        z
          .string()
          .trim()
          .optional(),

      to:
        z
          .string()
          .trim()
          .optional(),

    })

    .superRefine(
      (
        data,
        ctx
      ) => {

        // ------------------------------------------------
        // Custom period requires both dates
        // ------------------------------------------------

        if (
          data.period === "custom"
        ) {

          if (!data.from) {

            ctx.addIssue({

              code:
                z.ZodIssueCode.custom,

              path: [
                "from",
              ],

              message:
                "From date is required for custom period",

            });

          }


          if (!data.to) {

            ctx.addIssue({

              code:
                z.ZodIssueCode.custom,

              path: [
                "to",
              ],

              message:
                "To date is required for custom period",

            });

          }
        }


        // ------------------------------------------------
        // Prevent dates without custom period
        // ------------------------------------------------

        if (
          (data.from || data.to) &&
          data.period !== "custom"
        ) {

          ctx.addIssue({

            code:
              z.ZodIssueCode.custom,

            path: [
              "period",
            ],

            message:
              "From and to dates can only be used with custom period",

          });

        }

      }
    );