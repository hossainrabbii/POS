import type { Document } from "mongoose";

// ======================================================
// SHOP SETTINGS
// ======================================================

export interface IShop extends Document {
  name: string;
  logo?: string;

  phone?: string;
  alternativePhone?: string;
  email?: string;

  address?: string;
  city?: string;

  website?: string;

  receiptFooter?: string;

  createdAt?: Date;
  updatedAt?: Date;
}