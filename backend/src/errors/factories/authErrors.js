import { AppError } from "../AppErrors.js"
import { ERROR_CODES } from "../errorCodes.js"
import { HTTP_STATUS } from '../../../src/constants/httpStatus.js'


export const authErrors = {
  userAlreadyExists() {
    return new AppError(
      "User Already Exists",
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.USER_ALREADY_EXISTS
    )
  },

  userNotFound() {
    return new AppError(
      "User not found",
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.USER_NOT_FOUND
    )
  },
  unauthorized() {
    return new AppError(
      "Unauthorzied",
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED
    )
  },
  invalidOAuthState() {
    return new AppError(
      "Invalid Authentication",
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED
    )
  },

  invalidCredentials() {
    return new AppError(
      "Invalid email or password",
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_CREDENTIALS
    )
  },
  invalidPassword() {
    return new AppError(
      "Invalid password",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_CREDENTIALS
    )
  },
  accountNotVerified() {
    return new AppError(
      "Account not verified",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_CREDENTIALS
    )
  },

  otpInvalid() {
    return new AppError(
      "Invalid OTP",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.OTP_INVALID
    )
  },

  otpExpired() {
    return new AppError(
      "OTP expired",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.OTP_EXPIRED
    )
  },
  otpAttemptsExceeded() {
    return new AppError(
      "Limit excceded",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.OTP_LIMIT_EXCEEDED
    )
  },
  otpResendLimitExceeded() {
    return new AppError(
      "OTP Resend limit Exceeded",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.OTP_RESEND_LIMIT_EXCEEDED
    )
  }
}