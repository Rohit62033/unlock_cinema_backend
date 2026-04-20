import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { AppError } from "../../../errors/AppErrors.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"
import { errorFactory } from "../../../errors/errorFactory.js"
import {PasswordReset} from "../models/passwordReset.model.js"

export const PasswordResetRepository = {
  async createPasswordResetUser(data) {
    try {
      return await PasswordReset.create(data)
    } catch (error) {
      throw errorFactory.database.passwordResetError()
    }
  },

  async savePasswordReset(userDoc) {
    try {
      return await userDoc.save()
    } catch (error) {
      throw new AppError(
        "Database error",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.CONFLICT
      )
    }
  },
  async findPasswordResetByEmail(email) {

    try {
      return await PasswordReset.findOne({ email })
    } catch (error) {
      throw new AppError(
        "Database error",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async deletePasswordResetByEmail(email) {
    try {
      return await PasswordReset.deleteOne({ email })
    } catch (error) {
      throw new AppError(
        "Database error",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  }
}
