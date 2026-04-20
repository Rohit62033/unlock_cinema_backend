import { Booking } from "./booking.model.js"

export const bookingRepository = {
  async confirmBooking(bookingId, paymentId) {
    return await Booking.findByIdAndUpdate(bookingId, {
      status: "CONFIRMED",
      paymentId
    })
  }
}