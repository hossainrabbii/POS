import type {
  Request,
  Response,
} from "express";

import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  verifyEmail,
  verifyResetOtp,
} from "./auth.service.js";

import {
  forgotPasswordValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
  resetPasswordValidation,
  verifyEmailValidation,
  verifyResetOtpValidation,
} from "./auth.validation.js";

import type {
  AuthenticatedRequest,
} from "../../middlewares/authMiddleware.js";


// ======================================================
// REGISTER
// ======================================================

export const register =
  async (
    req: Request,
    res: Response
  ) => {
    const data =
      registerValidation.parse(
        req.body
      );

    const result =
      await registerUser(data);

    res.status(200).json({
      success: true,

      message:
        result.message,
    });
  };


// ======================================================
// VERIFY EMAIL
// ======================================================

export const verifyEmailController =
  async (
    req: Request,
    res: Response
  ) => {
    const data =
      verifyEmailValidation.parse(
        req.body
      );

    const result =
      await verifyEmail(
        data.email,
        data.otp
      );

    res.status(201).json({
      success: true,

      message:
        "Email verified and account created successfully",

      data: result,
    });
  };


// ======================================================
// LOGIN
// ======================================================

export const login =
  async (
    req: Request,
    res: Response
  ) => {
    const data =
      loginValidation.parse(
        req.body
      );

    const result =
      await loginUser(data);

    res.status(200).json({
      success: true,

      message:
        "Login successful",

      data: result,
    });
  };


// ======================================================
// REFRESH TOKEN
// ======================================================

export const refreshToken =
  async (
    req: Request,
    res: Response
  ) => {
    const data =
      refreshTokenValidation.parse(
        req.body
      );

    const result =
      await refreshAccessToken(
        data.refreshToken
      );

    res.status(200).json({
      success: true,

      message:
        "Access token refreshed",

      data: result,
    });
  };


// ======================================================
// LOGOUT
// ======================================================

export const logout =
  async (
    req: Request,
    res: Response
  ) => {
    const data =
      refreshTokenValidation.parse(
        req.body
      );

    await logoutUser(
      data.refreshToken
    );

    res.status(200).json({
      success: true,

      message:
        "Logout successful",
    });
  };


// ======================================================
// ME
// ======================================================

export const getMe =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    res.status(200).json({
      success: true,

      message:
        "Authentication successful",

      data: {
        userId:
          req.userId,
      },
    });
  };


// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPasswordController =
  async (
    req: Request,
    res: Response
  ) => {
    const data =
      forgotPasswordValidation.parse(
        req.body
      );

    const result =
      await forgotPassword(
        data.email
      );

    res.status(200).json({
      success: true,

      message:
        result.message,
    });
  };


// ======================================================
// VERIFY RESET OTP
// ======================================================

export const verifyResetOtpController =
  async (
    req: Request,
    res: Response
  ) => {
    const data =
      verifyResetOtpValidation.parse(
        req.body
      );

    const result =
      await verifyResetOtp(
        data.email,
        data.otp
      );

    res.status(200).json({
      success: true,

      message:
        "OTP verified successfully",

      data: result,
    });
  };


// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPasswordController =
  async (
    req: Request,
    res: Response
  ) => {
    const data =
      resetPasswordValidation.parse(
        req.body
      );

    await resetPassword(
      data.resetToken,
      data.password
    );

    res.status(200).json({
      success: true,

      message:
        "Password reset successful",
    });
  };