import jwt from "jsonwebtoken"
import { AppError } from "../../../errors/AppErrors.js"
import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"

export const tokenService = {

  // ================= ACCESS TOKEN =================
  generateAccessToken(userId, role) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    )
  },

  // ================= REFRESH TOKEN =================
  generateRefreshToken(userId, role) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    )
  },

  // ================= GENERATE BOTH =================
  generateTokens(userId, role) {
    const accessToken = this.generateAccessToken(userId, role)
    const refreshToken = this.generateRefreshToken(userId, role)

    return { accessToken, refreshToken }
  },

  // ================= VERIFY ACCESS =================
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    } catch (error) {
      throw new AppError(
        "Invalid or expired Session",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED
      )
    }
  },

  // ================= VERIFY REFRESH =================
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
      throw new AppError(
        "Invalid or expired refresh token",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.AUTHENTICATION_ERROR
      )
    }
  }

}