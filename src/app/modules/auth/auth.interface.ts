import type { UserRole, UserStatus } from "../user/user.interface.js";


export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface IAuthResponse {
  user: IAuthUser;
  accessToken: string;
  refreshToken: string;
}