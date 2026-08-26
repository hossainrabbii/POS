import type {
    Request,
    Response,
  } from "express";
  
  import {
    loginUser,
    refreshAccessToken,
    registerUser,
  } from "./auth.service.js";
  
  import {
    loginValidation,
    refreshTokenValidation,
    registerValidation,
  } from "./auth.validation.js";
  
  export const register = async (
    req: Request,
    res: Response
  ) => {
    const validatedData =
      registerValidation.parse(req.body);
  
    const result = await registerUser(
      validatedData
    );
  
    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  };
  
  export const login = async (
    req: Request,
    res: Response
  ) => {
    const validatedData =
      loginValidation.parse(req.body);
  
    const result = await loginUser(
      validatedData
    );
  
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  };
  
  export const refreshToken = async (
    req: Request,
    res: Response
  ) => {
    const validatedData =
      refreshTokenValidation.parse(req.body);
  
    const result = await refreshAccessToken(
      validatedData.refreshToken
    );
  
    res.status(200).json({
      success: true,
      message: "Access token refreshed",
      data: result,
    });
  };
  
  export const logout = async (
    req: Request,
    res: Response
  ) => {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  };