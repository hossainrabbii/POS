import type { IUserRole } from "../user/user.interface.js";

// ======================================================
// REGISTER
// ======================================================

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ======================================================
// LOGIN
// ======================================================

export interface ILoginPayload {
  email: string;
  password: string;
}

// ======================================================
// JWT PAYLOAD
// ======================================================

export interface IAccessTokenPayload {
  userId: string;
  role: IUserRole;
}

export interface IRefreshTokenPayload {
  userId: string;
}

// ======================================================
// AUTH RESPONSE
// ======================================================

export interface IAuthResponse {
  accessToken: string;

  refreshToken: string;

  user: {
    id: string;
    name: string;
    email: string;
    role: IUserRole;
    status: string;
  };
}
