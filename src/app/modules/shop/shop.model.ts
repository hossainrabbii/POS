import { Schema, model } from "mongoose";

import type { IShop } from "./shop.interface.js";

const shopSchema = new Schema<IShop>(
  {
    // ==================================================
    // SHOP NAME
    // ==================================================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // ==================================================
    // LOGO
    // ==================================================

    logo: {
      type: String,
      trim: true,
    },

    // ==================================================
    // PHONE
    // ==================================================

    phone: {
      type: String,
      trim: true,
    },

    // ==================================================
    // ALTERNATIVE PHONE
    // ==================================================

    alternativePhone: {
      type: String,
      trim: true,
    },

    // ==================================================
    // EMAIL
    // ==================================================

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // ==================================================
    // ADDRESS
    // ==================================================

    address: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // ==================================================
    // CITY
    // ==================================================

    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // ==================================================
    // WEBSITE
    // ==================================================

    website: {
      type: String,
      trim: true,
    },

    // ==================================================
    // RECEIPT FOOTER
    // ==================================================

    receiptFooter: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "Thank you for your purchase!",
    },
  },
  {
    timestamps: true,
  },
);

export const Shop = model<IShop>("Shop", shopSchema);
