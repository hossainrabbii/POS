import {
  Types,
} from "mongoose";

import {
  Product,
} from "../product/product.model.js";

import {
  Sale,
} from "./sale.model.js";

import type {
  IAddSalePayment,
  ICreateSale,
  ISale,
} from "./sale.interface.js";


// ======================================================
// GENERATE INVOICE NUMBER
// ======================================================

const generateInvoiceNumber =
  (): string => {

    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        now.getDate()
      ).padStart(2, "0");

    const randomPart =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `INV-${year}${month}-${day}-${randomPart}`;
  };


// ======================================================
// CREATE SALE
// ======================================================

export const createSale =
  async (
    data: ICreateSale,
    userId: string
  ): Promise<ISale> => {

    if (
      !Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new Error(
        "Invalid authenticated user ID"
      );
    }


    // --------------------------------------------------
    // Validate duplicate products
    // --------------------------------------------------

    const productIds =
      data.items.map(
        (item) =>
          item.productId
      );

    const uniqueProductIds =
      new Set(
        productIds
      );

    if (
      uniqueProductIds.size !==
      productIds.length
    ) {
      throw new Error(
        "The same product cannot appear multiple times in one sale"
      );
    }


    // --------------------------------------------------
    // Validate product IDs
    // --------------------------------------------------

    for (
      const productId
      of productIds
    ) {

      if (
        !Types.ObjectId.isValid(
          productId
        )
      ) {
        throw new Error(
          `Invalid product ID: ${productId}`
        );
      }
    }


    // ==================================================
    // START TRANSACTION
    // ==================================================

    const session =
      await Sale.startSession();

    session.startTransaction();


    try {

      const saleItems = [];

      let subtotal = 0;


      // ==================================================
      // PROCESS PRODUCTS
      // ==================================================

      for (
        const item
        of data.items
      ) {

        const product =
          await Product.findById(
            item.productId
          ).session(
            session
          );


        if (!product) {
          throw new Error(
            `Product not found: ${item.productId}`
          );
        }


        if (
          !product.isActive
        ) {
          throw new Error(
            `Product "${product.name}" is inactive`
          );
        }


        if (
          product.quantity <
          item.quantity
        ) {
          throw new Error(
            `Insufficient stock for "${product.name}". Available: ${product.quantity}, requested: ${item.quantity}`
          );
        }


        const itemSubtotal =
          product.sellingPrice *
          item.quantity;


        saleItems.push({

          product:
            product._id,

          quantity:
            item.quantity,

          purchasePrice:
            product.purchasePrice,

          unitPrice:
            product.sellingPrice,

          ...(item.warrantyMonths !==
          undefined
            ? {
                warrantyMonths:
                  item.warrantyMonths,
              }
            : {}),

          subtotal:
            itemSubtotal,
        });


        subtotal +=
          itemSubtotal;


        // ------------------------------------------------
        // Decrease stock safely
        // ------------------------------------------------

        const updatedProduct =
          await Product.findOneAndUpdate(

            {
              _id:
                product._id,

              quantity: {
                $gte:
                  item.quantity,
              },

              isActive:
                true,
            },

            {
              $inc: {
                quantity:
                  -item.quantity,
              },
            },

            {
              new: true,

              session,
            }
          );


        if (
          !updatedProduct
        ) {
          throw new Error(
            `Unable to update stock for "${product.name}"`
          );
        }
      }


      // ==================================================
      // DISCOUNT
      // ==================================================

      const discount =
        data.discount ?? 0;


      if (
        discount >
        subtotal
      ) {
        throw new Error(
          "Discount cannot be greater than subtotal"
        );
      }


      // ==================================================
      // TOTAL
      // ==================================================

      const totalAmount =
        subtotal -
        discount;


      // ==================================================
      // PAID AMOUNT
      // ==================================================

      const paidAmount =
        data.paidAmount;


      if (
        paidAmount >
        totalAmount
      ) {
        throw new Error(
          "Paid amount cannot be greater than total amount"
        );
      }


      // ==================================================
      // DUE AMOUNT
      // ==================================================

      const dueAmount =
        totalAmount -
        paidAmount;


      // ==================================================
      // DUE COMMITMENT
      // ==================================================

      if (
        data.dueCommitmentMonths !==
          undefined &&
        dueAmount === 0
      ) {
        throw new Error(
          "Due commitment cannot be added when there is no due amount"
        );
      }


      // ==================================================
      // GENERATE INVOICE NUMBER
      // ==================================================

      const invoiceNumber =
        generateInvoiceNumber();


      // ==================================================
      // INITIAL PAYMENT HISTORY
      // ==================================================

      const payments =
        paidAmount > 0
          ? [
              {
                amount:
                  paidAmount,

                receivedBy:
                  new Types.ObjectId(
                    userId
                  ),

                paidAt:
                  new Date(),
              },
            ]
          : [];


      // ==================================================
      // CREATE SALE
      // ==================================================

      const createdSales =
        await Sale.create(
          [
            {

              invoiceNumber,

              soldBy:
                new Types.ObjectId(
                  userId
                ),

              customer:
                data.customer,

              items:
                saleItems,

              subtotal,

              discount,

              totalAmount,

              paidAmount,

              dueAmount,

              payments,

              ...(data.dueCommitmentMonths !==
              undefined
                ? {
                    dueCommitmentMonths:
                      data.dueCommitmentMonths,
                  }
                : {}),
            },
          ],
          {
            session,
          }
        );


      const sale =
        createdSales[0];


      if (!sale) {
        throw new Error(
          "Failed to create sale"
        );
      }


      // ==================================================
      // COMMIT TRANSACTION
      // ==================================================

      await session.commitTransaction();


      // ==================================================
      // POPULATE
      // ==================================================

      await sale.populate([
        {
          path: "soldBy",

          select:
            "name email role",
        },

        {
          path:
            "items.product",

          select:
            "name sku",
        },

        {
          path:
            "payments.receivedBy",

          select:
            "name email role",
        },
      ]);


      return sale;

    } catch (
      error
    ) {

      await session.abortTransaction();

      throw error;

    } finally {

      await session.endSession();
    }
  };


// ======================================================
// ADD PAYMENT TO EXISTING SALE
// ======================================================

export const addSalePayment =
  async (
    saleId: string,
    data: IAddSalePayment,
    userId: string
  ): Promise<ISale> => {

    // --------------------------------------------------
    // Validate IDs
    // --------------------------------------------------

    if (
      !Types.ObjectId.isValid(
        saleId
      )
    ) {
      throw new Error(
        "Invalid sale ID"
      );
    }


    if (
      !Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new Error(
        "Invalid authenticated user ID"
      );
    }


    // --------------------------------------------------
    // Find sale
    // --------------------------------------------------

    const sale =
      await Sale.findById(
        saleId
      );


    if (!sale) {
      throw new Error(
        "Sale not found"
      );
    }


    // --------------------------------------------------
    // Make sure there is due
    // --------------------------------------------------

    if (
      sale.dueAmount <= 0
    ) {
      throw new Error(
        "This sale has no outstanding due amount"
      );
    }


    // --------------------------------------------------
    // Prevent overpayment
    // --------------------------------------------------

    if (
      data.amount >
      sale.dueAmount
    ) {
      throw new Error(
        `Payment cannot be greater than due amount. Current due: ${sale.dueAmount}`
      );
    }


    // --------------------------------------------------
    // Add payment
    // --------------------------------------------------

    sale.payments.push({

      amount:
        data.amount,

      receivedBy:
        new Types.ObjectId(
          userId
        ),

      paidAt:
        new Date(),

    });


    // --------------------------------------------------
    // Update totals
    // --------------------------------------------------

    sale.paidAmount +=
      data.amount;

    sale.dueAmount =
      sale.totalAmount -
      sale.paidAmount;


    // --------------------------------------------------
    // Save
    // --------------------------------------------------

    await sale.save();


    // --------------------------------------------------
    // Populate
    // --------------------------------------------------

    await sale.populate([
      {
        path:
          "soldBy",

        select:
          "name email role",
      },

      {
        path:
          "items.product",

        select:
          "name sku",
      },

      {
        path:
          "payments.receivedBy",

        select:
          "name email role",
      },
    ]);


    return sale;
  };

// // ======================================================
// GET ALL SALES
// ======================================================

export const getAllSales =
  async (
    page: number,
    limit: number,
    search?: string,
    paymentStatus?: "PAID" | "DUE",
    soldBy?: string,
    from?: string,
    to?: string
  ) => {

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const skip =
      (page - 1) * limit;


    // --------------------------------------------------
    // Build query
    // --------------------------------------------------

    const query: Record<
      string,
      unknown
    > = {};


    // --------------------------------------------------
    // Search
    // --------------------------------------------------

    if (search) {

      query.$or = [

        {
          invoiceNumber: {
            $regex: search,
            $options: "i",
          },
        },

        {
          "customer.name": {
            $regex: search,
            $options: "i",
          },
        },

        {
          "customer.phone": {
            $regex: search,
            $options: "i",
          },
        },

      ];
    }


    // --------------------------------------------------
    // Payment Status
    // --------------------------------------------------

    if (
      paymentStatus === "PAID"
    ) {

      query.dueAmount = 0;

    }

    if (
      paymentStatus === "DUE"
    ) {

      query.dueAmount = {
        $gt: 0,
      };

    }


    // --------------------------------------------------
    // Seller
    // --------------------------------------------------

    if (soldBy) {

      if (
        !Types.ObjectId.isValid(
          soldBy
        )
      ) {
        throw new Error(
          "Invalid seller ID"
        );
      }

      query.soldBy =
        new Types.ObjectId(
          soldBy
        );
    }


    // --------------------------------------------------
    // Date Range
    // --------------------------------------------------

    if (from || to) {

      const createdAt: Record<
        string,
        Date
      > = {};


      if (from) {

        const fromDate =
          new Date(from);

        if (
          Number.isNaN(
            fromDate.getTime()
          )
        ) {
          throw new Error(
            "Invalid from date"
          );
        }

        fromDate.setHours(
          0,
          0,
          0,
          0
        );

        createdAt.$gte =
          fromDate;
      }


      if (to) {

        const toDate =
          new Date(to);

        if (
          Number.isNaN(
            toDate.getTime()
          )
        ) {
          throw new Error(
            "Invalid to date"
          );
        }

        toDate.setHours(
          23,
          59,
          59,
          999
        );

        createdAt.$lte =
          toDate;
      }


      query.createdAt =
        createdAt;
    }


    // --------------------------------------------------
    // Fetch sales + total
    // --------------------------------------------------

    const [
      sales,
      total,
    ] = await Promise.all([

      Sale.find(query)

        .populate({
          path: "soldBy",
          select:
            "name email role",
        })

        .populate({
          path:
            "items.product",
          select:
            "name sku",
        })

        .populate({
          path:
            "payments.receivedBy",
          select:
            "name email role",
        })

        .sort({
          createdAt: -1,
        })

        .skip(skip)

        .limit(limit)

        .lean(),

      Sale.countDocuments(
        query
      ),

    ]);


    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const totalPages =
      Math.ceil(
        total / limit
      );


    // --------------------------------------------------
    // Return
    // --------------------------------------------------

    return {

      sales,

      pagination: {

        currentPage:
          page,

        limit,

        totalRecords:
          total,

        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,

      },

    };
  };

// ======================================================
// GET SINGLE SALE
// ======================================================

export const getSaleById =
  async (
    saleId: string
  ): Promise<ISale> => {

    // --------------------------------------------------
    // Validate sale ID
    // --------------------------------------------------

    if (
      !Types.ObjectId.isValid(
        saleId
      )
    ) {
      throw new Error(
        "Invalid sale ID"
      );
    }


    // --------------------------------------------------
    // Find sale
    // --------------------------------------------------

    const sale =
      await Sale.findById(
        saleId
      )
        .populate({
          path: "soldBy",
          select:
            "name email role",
        })
        .populate({
          path:
            "items.product",
          select:
            "name sku",
        })
        .populate({
          path:
            "payments.receivedBy",
          select:
            "name email role",
        });


    // --------------------------------------------------
    // Sale not found
    // --------------------------------------------------

    if (!sale) {
      throw new Error(
        "Sale not found"
      );
    }


    // --------------------------------------------------
    // Return sale
    // --------------------------------------------------

    return sale;
  };

  // ======================================================
// GET SALES STATISTICS
// ======================================================

export const getSalesStatistics =
  async () => {

    // --------------------------------------------------
    // Aggregate sales statistics
    // --------------------------------------------------

    const result =
      await Sale.aggregate([

        // ------------------------------------------------
        // Unwind sale items
        // ------------------------------------------------

        {
          $unwind: "$items",
        },


        // ------------------------------------------------
        // Calculate item gross profit
        // ------------------------------------------------

        {
          $addFields: {

            itemProfit: {
              $multiply: [

                {
                  $subtract: [
                    "$items.unitPrice",
                    "$items.purchasePrice",
                  ],
                },

                "$items.quantity",

              ],
            },

          },
        },


        // ------------------------------------------------
        // Group everything
        // ------------------------------------------------

        {
          $group: {

            _id: null,

            totalSales: {
              $sum: "$totalAmount",
            },

            totalPaid: {
              $sum: "$paidAmount",
            },

            totalDue: {
              $sum: "$dueAmount",
            },

            totalProfit: {
              $sum: "$itemProfit",
            },

            totalTransactions: {
              $addToSet: "$_id",
            },

          },
        },

      ]);


    // --------------------------------------------------
    // No sales
    // --------------------------------------------------

    if (!result[0]) {

      return {

        totalSales: 0,

        totalPaid: 0,

        totalDue: 0,

        totalProfit: 0,

        totalTransactions: 0,

      };
    }


    // --------------------------------------------------
    // Return statistics
    // --------------------------------------------------

    return {

      totalSales:
        result[0].totalSales,

      totalPaid:
        result[0].totalPaid,

      totalDue:
        result[0].totalDue,

      totalProfit:
        result[0].totalProfit,

      totalTransactions:
        result[0].totalTransactions.length,

    };
  };