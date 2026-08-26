import jwt from "jsonwebtoken";

import type {
  NextFunction,
  Request,
  Response,
} from "express";
import appConfig from "../appConfig/index.js";


export interface AuthenticatedRequest
  extends Request {
  userId?: string;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

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

    const decoded = jwt.verify(
      token,
      appConfig.access_token_secret as string
    ) as {
      userId: string;
    };

    req.userId = decoded.userId;

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