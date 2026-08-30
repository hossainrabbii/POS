import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";
import appConfig from "../appConfig/index.js";
import type {
  IAccessTokenPayload,
} from "../modules/auth/auth.interface.js";


// ======================================================
// AUTHENTICATED REQUEST
// ======================================================

export interface AuthenticatedRequest
  extends Request {
  userId?: string | undefined;
  role?:
    IAccessTokenPayload["role"] |
    undefined;
}


// ======================================================
// AUTH MIDDLEWARE
// ======================================================

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  const authorization =
    req.headers.authorization;


  // ----------------------------------------------------
  // Authorization header
  // ----------------------------------------------------

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message:
        "No authorization header provided",
    });
  }


  // ----------------------------------------------------
  // Bearer token
  // ----------------------------------------------------

  const [type, token] =
    authorization.split(" ");


  if (
    type !== "Bearer" ||
    !token
  ) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid authorization format",
    });
  }


  try {

    // --------------------------------------------------
    // Verify access token
    // --------------------------------------------------

    const decoded =
      jwt.verify(
        token,
        appConfig.access_token_secret
      ) as IAccessTokenPayload;


    // --------------------------------------------------
    // Attach authenticated user
    // --------------------------------------------------

    req.userId =
      decoded.userId;

    req.role =
      decoded.role;
    next();

  } catch {

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired access token",
    });
  }
};


export default authMiddleware;