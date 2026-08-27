import {
  Schema,
  model,
} from "mongoose";

import type {
  IUser,
  UserRole,
  UserStatus,
} from "./user.interface.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "OWNER",
        "EMPLOYEE",
      ] satisfies UserRole[],
      default: "OWNER",
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
      ] satisfies UserStatus[],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>(
  "User",
  userSchema
);