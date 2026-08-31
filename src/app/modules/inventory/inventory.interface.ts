import type { Types } from "mongoose";

export type StockMovementType = "STOCK_IN" | "SALE" | "ADJUSTMENT";

export interface IStockMovement {
  productId: Types.ObjectId;
  type: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  referenceId?: Types.ObjectId | null;
  note?: string | null;
  performedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
