import { HTTP_STATUS } from "../../constants/httpStatus.js"
import { AppError } from "../AppErrors.js"
import { ERROR_CODES } from "../errorCodes.js"

export const validationErrors ={
  invalidInput(message){
    return new AppError(
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    )
  }
}