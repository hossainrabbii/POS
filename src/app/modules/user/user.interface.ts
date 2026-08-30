import type { Document } from "mongoose";

// ======================================================
// USER ROLE
// ======================================================

export type IUserRole = "OWNER" | "EMPLOYEE";

// ======================================================
// USER STATUS
// ======================================================

export type IUserStatus = "ACTIVE" | "INACTIVE";

// ======================================================
// USER
// ======================================================

export interface IUser extends Document {
  name: string;

  email: string;

  password: string;

  role: IUserRole;

  status: IUserStatus;

  passwordResetToken?: string;

  passwordResetExpires?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
