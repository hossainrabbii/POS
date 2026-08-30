import {
    Schema,
    model,
  } from "mongoose";
  
  import type {
    IStockMovement,
  } from "./inventory.interface.js";
  
  const stockMovementSchema =
    new Schema<IStockMovement>(
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
  
        type: {
          type: String,
          enum: [
            "STOCK_IN",
            "SALE",
            "ADJUSTMENT",
          ],
          required: true,
        },
  
        quantity: {
          type: Number,
          required: true,
        },
  
        previousQuantity: {
          type: Number,
          required: true,
          min: 0,
        },
  
        newQuantity: {
          type: Number,
          required: true,
          min: 0,
        },
  
        referenceId: {
          type: Schema.Types.ObjectId,
          default: null,
        },
  
        note: {
          type: String,
          default: null,
          trim: true,
        },
  
        performedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
  
      {
        timestamps: true,
      }
    );
  
  export const StockMovement =
    model<IStockMovement>(
      "StockMovement",
      stockMovementSchema
    );