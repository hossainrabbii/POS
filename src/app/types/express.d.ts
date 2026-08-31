import type { IUserRole } from "../modules/auth/user.interface.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: IUserRole;
      };
    }
  }
}

export {};
