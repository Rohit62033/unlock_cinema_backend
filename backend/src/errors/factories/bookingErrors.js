import { HTTP_STATUS } from "../../../src/constants/httpStatus.js"
import { ERROR_CODES } from "../errorCodes.js"
import { AppError } from '../AppErrors.js'

export const bookingErrors = {
  seatAlreadyBooked() {
    return new AppError(
      "Seat already booked",
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.SEAT_ALREADY_BOOKED
    )
  },

  bookingNotFound() {
    return new AppError(
      "Booking not foundd",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BOOKING_NOT_FOUND
    )
  }

}