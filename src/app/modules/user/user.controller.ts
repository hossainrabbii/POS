import type { Response } from "express";

import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";

import { getAllUsers } from "./user.service.js";

// ======================================================
// GET ALL USERS
// ======================================================

export const getAllUsersController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // --------------------------------------------------
  // Get users
  // --------------------------------------------------

  const result = await getAllUsers();

  // --------------------------------------------------
  // Response
  // --------------------------------------------------

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
};