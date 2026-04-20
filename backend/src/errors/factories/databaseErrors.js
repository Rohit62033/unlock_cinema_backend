import { HTTP_STATUS } from "../../constants/httpStatus.js"
import { AppError } from "../AppErrors.js"
import { ERROR_CODES } from "../errorCodes.js"

export const databaseErrors ={
  duplicateKey(){
    return new AppError(
      "Duplicate resource",
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.DATABASE_ERROR
    )
  },
  recordNotFound(){
    return new AppError(
      "Resource not found",
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.DATABASE_ERROR
    )
  },
 userCreationError(){
  return new AppError(
    "Failed to create user",
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.DATABASE_ERROR
  )
 },
 passwordResetError(){
  return new AppError(
    "Failed to reset",
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.BAD_REQUEST
  )
 }
}