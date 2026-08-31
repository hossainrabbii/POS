import type { Types } from "mongoose";

export interface IProduct {
  name: string;
  sku: string;
  categoryId: Types.ObjectId;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  description?: string | undefined;
  image?: string | undefined;
  isActive: boolean;
}

export interface ICreateProduct {
  name: string;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold?: number | undefined;
  description?: string | undefined;
  image?: string | undefined;
}

export interface IUpdateProduct {
  name?: string | undefined;
  categoryId?: string | undefined;
  purchasePrice?: number | undefined;
  sellingPrice?: number | undefined;
  quantity?: number | undefined;
  lowStockThreshold?: number | undefined;
  description?: string | undefined;
  image?: string | undefined;
  isActive?: boolean | undefined;
}
