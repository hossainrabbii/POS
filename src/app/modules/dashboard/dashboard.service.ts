import { Product } from "../product/product.model.js";

import { Sale } from "../sale/sale.model.js";

// ======================================================
// TYPES
// ======================================================

type DashboardPeriod = "today" | "week" | "month" | "year" | "custom";

// ======================================================
// DATE RANGE HELPER
// ======================================================

const getDateRange = (
  period: DashboardPeriod,
  year?: number,
  from?: string,
  to?: string,
) => {
  let fromDate: Date;

  let toDate: Date;

  // ==================================================
  // TODAY
  // ==================================================

  if (period === "today") {
    fromDate = new Date();

    fromDate.setHours(0, 0, 0, 0);

    toDate = new Date();

    toDate.setHours(23, 59, 59, 999);

    return {
      fromDate,
      toDate,
    };
  }

  // ==================================================
  // LAST 7 DAYS
  // ==================================================

  if (period === "week") {
    const now = new Date();

    fromDate = new Date(now);

    // Today + previous 6 days
    // = exactly 7 calendar days

    fromDate.setDate(fromDate.getDate() - 6);

    fromDate.setHours(0, 0, 0, 0);

    toDate = new Date(now);

    toDate.setHours(23, 59, 59, 999);

    return {
      fromDate,
      toDate,
    };
  }

  // ==================================================
  // CURRENT MONTH
  // ==================================================

  if (period === "month") {
    const now = new Date();

    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);

    fromDate.setHours(0, 0, 0, 0);

    toDate = new Date(now);

    toDate.setHours(23, 59, 59, 999);

    return {
      fromDate,
      toDate,
    };
  }

  // ==================================================
  // YEAR
  // ==================================================

  if (period === "year") {
    const selectedYear = year ?? new Date().getFullYear();

    fromDate = new Date(selectedYear, 0, 1);

    fromDate.setHours(0, 0, 0, 0);

    toDate = new Date(selectedYear, 11, 31);

    toDate.setHours(23, 59, 59, 999);

    return {
      fromDate,
      toDate,
    };
  }

  // ==================================================
  // CUSTOM
  // ==================================================

  if (period === "custom") {
    if (!from || !to) {
      throw new Error("Both from and to dates are required for custom period");
    }

    fromDate = new Date(from);

    toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime())) {
      throw new Error("Invalid from date");
    }

    if (Number.isNaN(toDate.getTime())) {
      throw new Error("Invalid to date");
    }

    fromDate.setHours(0, 0, 0, 0);

    toDate.setHours(23, 59, 59, 999);

    if (fromDate > toDate) {
      throw new Error("From date cannot be greater than to date");
    }

    return {
      fromDate,
      toDate,
    };
  }

  throw new Error("Invalid dashboard period");
};

// ======================================================
// GET DASHBOARD OVERVIEW
// ======================================================

export const getDashboardOverview = async (
  period: DashboardPeriod,

  year?: number,

  from?: string,

  to?: string,
) => {
  // ==================================================
  // DATE RANGE
  // ==================================================

  const { fromDate, toDate } = getDateRange(period, year, from, to);

  // ==================================================
  // SALES MATCH
  // ==================================================

  const salesMatch = {
    createdAt: {
      $gte: fromDate,

      $lte: toDate,
    },
  };
// ======================================================
// RUN QUERIES
// ======================================================

const [

  // ----------------------------------------------
  // Product count
  // ----------------------------------------------

  totalProducts,

  // ----------------------------------------------
  // Total current stock
  // ----------------------------------------------

  stockResult,

  // ----------------------------------------------
  // Low stock count
  // ----------------------------------------------

  lowStockProducts,

  // ----------------------------------------------
  // Sales statistics
  // ----------------------------------------------

  salesStatistics,

  // ----------------------------------------------
  // Best-selling products
  // ----------------------------------------------

  bestSellingProducts,

] =
  await Promise.all([


    // ============================================
    // TOTAL ACTIVE PRODUCTS
    // ============================================

    Product.countDocuments({
      isActive: true,
    }),


    // ============================================
    // CURRENT STOCK
    // ============================================

    Product.aggregate([

      {
        $match: {
          isActive: true,
        },
      },

      {
        $group: {

          _id:
            null,

          totalStock: {
            $sum:
              "$quantity",
          },

        },
      },

    ]),


    // ============================================
    // LOW STOCK PRODUCTS
    // ============================================

    Product.countDocuments({

      isActive:
        true,

      $expr: {

        $lte: [

          "$quantity",

          "$lowStockThreshold",

        ],

      },

    }),


    // ============================================
    // SALES STATISTICS
    // ============================================

    Sale.aggregate([

      // ------------------------------------------
      // Filter by selected period
      // ------------------------------------------

      {
        $match:
          salesMatch,
      },


      // ------------------------------------------
      // Calculate sale profit
      // ------------------------------------------

      {
        $addFields: {

          saleProfit: {

            $sum: {

              $map: {

                input:
                  "$items",

                as:
                  "item",

                in: {

                  $multiply: [

                    {
                      $subtract: [

                        "$$item.unitPrice",

                        "$$item.purchasePrice",

                      ],
                    },

                    "$$item.quantity",

                  ],

                },

              },

            },

          },

        },

      },


      // ------------------------------------------
      // Group statistics
      // ------------------------------------------

      {
        $group: {

          _id:
            null,

          totalSales: {

            $sum:
              "$totalAmount",

          },

          totalPaid: {

            $sum:
              "$paidAmount",

          },

          totalDue: {

            $sum:
              "$dueAmount",

          },

          totalProfit: {

            $sum:
              "$saleProfit",

          },

          totalTransactions: {

            $sum:
              1,

          },

        },

      },

    ]),


    // ============================================
    // BEST-SELLING PRODUCTS
    // ============================================

    Sale.aggregate([

      // ------------------------------------------
      // Filter sales by selected period
      // ------------------------------------------

      {
        $match:
          salesMatch,
      },


      // ------------------------------------------
      // Break sale items into individual records
      // ------------------------------------------

      {
        $unwind:
          "$items",
      },


      // ------------------------------------------
      // Group by product
      // ------------------------------------------

      {
        $group: {

          _id:
            "$items.product",

          quantitySold: {

            $sum:
              "$items.quantity",

          },

          revenue: {

            $sum: {

              $multiply: [

                "$items.unitPrice",

                "$items.quantity",

              ],

            },

          },

        },

      },


      // ------------------------------------------
      // Highest quantity sold first
      // ------------------------------------------

      {
        $sort: {

          quantitySold:
            -1,

        },

      },


      // ------------------------------------------
      // Limit results
      // ------------------------------------------

      {
        $limit:
          10,

      },


      // ------------------------------------------
      // Get product information
      // ------------------------------------------

      {
        $lookup: {

          from:
            "products",

          localField:
            "_id",

          foreignField:
            "_id",

          as:
            "product",

        },

      },


      // ------------------------------------------
      // Convert product array to object
      // ------------------------------------------

      {
        $unwind: {

          path:
            "$product",

          preserveNullAndEmptyArrays:
            false,

        },

      },


      // ------------------------------------------
      // Only return active products
      // ------------------------------------------

      {
        $match: {

          "product.isActive":
            true,

        },

      },


      // ------------------------------------------
      // Shape response
      // ------------------------------------------

      {
        $project: {

          _id:
            0,

          productId:
            "$_id",

          name:
            "$product.name",

          sku:
            "$product.sku",

          quantitySold:
            1,

          revenue:
            1,

        },

      },

    ]),

  ]);

  
  // ==================================================
  // SALES RESULT
  // ==================================================

  const statistics = salesStatistics[0] ?? {
    totalSales: 0,

    totalPaid: 0,

    totalDue: 0,

    totalProfit: 0,

    totalTransactions: 0,
  };

  // ==================================================
  // STOCK RESULT
  // ==================================================

  const totalStock = stockResult[0]?.totalStock ?? 0;

  // ==================================================
  // RETURN
  // ==================================================

return {

  period,

  dateRange: {

    from:
      fromDate,

    to:
      toDate,

  },


  products: {

    totalProducts,

    totalStock,

    lowStockProducts,

  },


  sales: {

    totalSales:
      statistics.totalSales,

    totalPaid:
      statistics.totalPaid,

    totalDue:
      statistics.totalDue,

    totalProfit:
      statistics.totalProfit,

    totalTransactions:
      statistics.totalTransactions,

  },
  bestSellingProducts,
};
};
