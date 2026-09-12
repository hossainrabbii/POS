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

  phone?: string;
  alternativePhone?: string;
  address?: string;

  role: IUserRole;
  status: IUserStatus;

  designation?: string;
  salary?: number;
  joiningDate?: Date;

  passwordResetToken?: string;
  passwordResetExpires?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
