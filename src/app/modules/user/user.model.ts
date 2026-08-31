import { Schema, model } from "mongoose";

import type { IUser, IUserRole, IUserStatus } from "./user.interface.js";

const userSchema = new Schema<IUser>(
  {
    // ==================================================
    // NAME
    // ==================================================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    // ==================================================
    // EMAIL
    // ==================================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ==================================================
    // PASSWORD
    // ==================================================

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // ==================================================
    // ROLE
    // ==================================================

    role: {
      type: String,
      enum: ["OWNER", "EMPLOYEE"] satisfies IUserRole[],
      default: "OWNER",
    },

    // ==================================================
    // STATUS
    // ==================================================

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"] satisfies IUserStatus[],
      default: "ACTIVE",
    },
  },

  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);
