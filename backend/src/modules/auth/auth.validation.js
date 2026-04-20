import { z } from "zod"

export const sendOtpSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
})

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email("Invalid email format"),

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
})

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" })
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
})

export const registrationSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z.email({ message: "Invalid email address" })
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
})

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" })
    .trim(),
})

export const resetPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" })
    .trim(),
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
    .min(6, "Password must be at least 6 characters"),
  otp: z.string().min(6, "OTP must be 6 digit")
})

export const setPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
})

export const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  currentPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
})