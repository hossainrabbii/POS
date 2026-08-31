import { Schema, model } from "mongoose";

import type { ISale } from "./sale.interface.js";

// ======================================================
// SALE PAYMENT SCHEMA
// ======================================================

const salePaymentSchema = new Schema(
  {
    // --------------------------------------------------
    // PAYMENT AMOUNT
    // --------------------------------------------------

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // --------------------------------------------------
    // RECEIVED BY
    // --------------------------------------------------

    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --------------------------------------------------
    // PAYMENT DATE
    // --------------------------------------------------

    paidAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },

  {
    _id: true,
  },
);

// ======================================================
// SALE ITEM SCHEMA
// ======================================================

const saleItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    warrantyMonths: {
      type: Number,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },

  {
    _id: false,
  },
);

// ======================================================
// CUSTOMER SCHEMA
// ======================================================

const saleCustomerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },

  {
    _id: false,
  },
);

// ======================================================
// SALE SCHEMA
// ======================================================

const saleSchema = new Schema<ISale>(
  {
    // --------------------------------------------------
    // INVOICE NUMBER
    // --------------------------------------------------

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    // --------------------------------------------------
    // SOLD BY
    // --------------------------------------------------

    soldBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --------------------------------------------------
    // CUSTOMER
    // --------------------------------------------------

    customer: {
      type: saleCustomerSchema,
      required: true,
    },

    // --------------------------------------------------
    // SALE ITEMS
    // --------------------------------------------------

    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length > 0,
        message: "A sale must contain at least one product.",
      },
    },

    // --------------------------------------------------
    // SUBTOTAL
    // --------------------------------------------------

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // --------------------------------------------------
    // DISCOUNT
    // --------------------------------------------------

    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // --------------------------------------------------
    // TOTAL
    // --------------------------------------------------

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // --------------------------------------------------
    // PAID AMOUNT
    // --------------------------------------------------

    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // --------------------------------------------------
    // DUE AMOUNT
    // --------------------------------------------------

    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // --------------------------------------------------
    // DUE COMMITMENT
    // --------------------------------------------------

    dueCommitmentMonths: {
      type: Number,
      min: 0,
    },

    // --------------------------------------------------
    // PAYMENT HISTORY
    // --------------------------------------------------

    payments: {
      type: [salePaymentSchema],
      required: true,
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

// ======================================================
// MODEL
// ======================================================

export const Sale = model<ISale>("Sale", saleSchema);
