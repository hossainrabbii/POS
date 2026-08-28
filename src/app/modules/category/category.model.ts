import {Schema,model} from "mongoose";  
  import type {ICategory} from "./category.interface.js";
  
  const categorySchema =
    new Schema<ICategory>(
      {
        name: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          minlength: 2,
          maxlength: 50,
        },
  
        description: {
          type: String,
          trim: true,
          maxlength: 200,
        },
  
        isActive: {
          type: Boolean,
          default: true,
          required: true,
        },
      },
  
      {
        timestamps: true,
      }
    );
  
  export const Category =
    model<ICategory>(
      "Category",
      categorySchema
    );