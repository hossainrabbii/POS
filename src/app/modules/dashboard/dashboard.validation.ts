import { z } from "zod";

// ======================================================
// DASHBOARD OVERVIEW QUERY VALIDATION
// ======================================================

export const getDashboardOverviewValidation = z
  .object({
    // ------------------------------------------------
    // Period
    // ------------------------------------------------

    period: z
      .enum(["today", "week", "month", "year", "custom"])
      .default("today"),

    // ------------------------------------------------
    // Year
    // ------------------------------------------------

    year: z.coerce
      .number()
      .int()
      .min(2000, "Year must be 2000 or later")
      .max(2100, "Year cannot be greater than 2100")
      .optional(),

    // ------------------------------------------------
    // Custom date range
    // ------------------------------------------------

    from: z.string().trim().optional(),

    to: z.string().trim().optional(),
  })

  .superRefine((data, ctx) => {
    // ------------------------------------------------
    // Year only allowed with year period
    // ------------------------------------------------

    if (data.year !== undefined && data.period !== "year") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["year"],
        message: "Year can only be used with year period",
      });
    }

    // ------------------------------------------------
    // Custom period requires both dates
    // ------------------------------------------------

    if (data.period === "custom") {
      if (!data.from) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["from"],
          message: "From date is required for custom period",
        });
      }

      if (!data.to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["to"],
          message: "To date is required for custom period",
        });
      }
    }

    // ------------------------------------------------
    // Dates only allowed with custom period
    // ------------------------------------------------

    if ((data.from || data.to) && data.period !== "custom") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["period"],
        message: "From and to dates can only be used with custom period",
      });
    }
  });
