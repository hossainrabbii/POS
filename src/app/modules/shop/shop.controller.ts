import type { Response } from "express";

import {
  createShopSettings,
  getShopSettings,
  updateShopSettings,
} from "./shop.service.js";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";
import { createShopValidationSchema } from "./shop.validation.js";

// ======================================================
// GET SHOP SETTINGS
// ======================================================

export const getShopSettingsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const shop = await getShopSettings();

  return res.status(200).json({
    success: true,
    message: "Shop settings fetched successfully",
    data: shop,
  });
};

// ======================================================
// CREATE SHOP SETTINGS
// ======================================================

export const createShopSettingsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.role !== "OWNER") {
    return res.status(403).json({
      success: false,
      message: "Only owner can manage shop settings",
    });
  }

  const data = createShopValidationSchema.parse(req.body);
  const result = await createShopSettings(data);

  return res.status(201).json({
    success: true,
    message: "Shop settings created successfully",
    data: result,
  });
};

// ======================================================
// UPDATE SHOP SETTINGS
// ======================================================

export const updateShopSettingsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.role !== "OWNER") {
    return res.status(403).json({
      success: false,
      message: "Only owner can manage shop settings",
    });
  }

  const result = await updateShopSettings(req.body);

  return res.status(200).json({
    success: true,
    message: "Shop settings updated successfully",
    data: result,
  });
};
