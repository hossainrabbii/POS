import { z } from "zod";

export const registerValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .transform((value) =>
      value.toLowerCase().trim()
    ),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export const loginValidation = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((value) =>
      value.toLowerCase().trim()
    ),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const refreshTokenValidation = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),
});