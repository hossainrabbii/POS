// export type UserRole = "OWNER" | "EMPLOYEE";

// export type UserStatus = "ACTIVE" | "INACTIVE";

// export interface IUser {
//   name: string;
//   email: string;
//   password: string;
//   role: UserRole;
//   status: UserStatus;

//   passwordResetToken?: string | undefined;
//   passwordResetExpires?: Date | undefined;
// }


export type UserRole =
  | "OWNER"
  | "EMPLOYEE";

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface IUser {
  name: string;

  email: string;

  password: string;

  role: UserRole;

  status: UserStatus;
}