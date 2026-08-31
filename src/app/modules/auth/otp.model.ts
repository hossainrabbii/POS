import { Schema, model } from "mongoose";

import type { IOtp, OtpPurpose } from "./otp.interface.js";

const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"] satisfies OtpPurpose[],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
      required: true,
    },

    name: {
      type: String,
    },

    passwordHash: {
      type: String,
    },

    resetTokenHash: {
      type: String,
    },

    resetTokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

otpSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  },
);

otpSchema.index(
  {
    email: 1,
    purpose: 1,
  },
  {
    unique: true,
  },
);

export const Otp = model<IOtp>("Otp", otpSchema);
