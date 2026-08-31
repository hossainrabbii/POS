import { Router } from "express";

import authMiddleware from "../../middlewares/authMiddleware.js";

import {
  forgotPasswordController,
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resetPasswordController,
  verifyEmailController,
  verifyResetOtpController,
} from "./auth.controller.js";

const router = Router();

// Registration
router.post("/register", register);

router.post("/verify-email", verifyEmailController);

// Login
router.post("/login", login);

// Refresh token
router.post("/refresh-token", refreshToken);

// Logout
router.post("/logout", logout);

// Protected route
router.get("/me", authMiddleware, getMe);

// Password reset
router.post("/forgot-password", forgotPasswordController);

router.post("/verify-reset-otp", verifyResetOtpController);

router.post("/reset-password", resetPasswordController);

export default router;
