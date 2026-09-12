import { Router } from "express";

import authMiddleware from "../../middlewares/authMiddleware.js";

import {
  createShopSettingsController,
  getShopSettingsController,
  updateShopSettingsController,
} from "./shop.controller.js";

// import {
//   createShopValidationSchema,
//   updateShopValidationSchema,
// } from "./shop.validation.js";
// import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

// ======================================================
// AUTHENTICATION
// ======================================================

router.use(authMiddleware);

// ======================================================
// GET SHOP SETTINGS
// ======================================================

router.get("/", getShopSettingsController);

// ======================================================
// CREATE SHOP SETTINGS
// ======================================================

router.post("/", createShopSettingsController);

// ======================================================
// UPDATE SHOP SETTINGS
// ======================================================

router.patch("/", updateShopSettingsController);

export default router;
