import { AppError } from "../AppErrors.js"
import { ERROR_CODES } from "../errorCodes.js"
import { HTTP_STATUS } from "../../../src/constants/httpStatus.js"

export const paymentErrors = {

  paymentFailed() {
    return new AppError(
      "Payment failed",
      HTTP_STATUS.PAYMENT_REQUIRED,
      ERROR_CODES.PAYMENT_FAILED
    )
  }

}