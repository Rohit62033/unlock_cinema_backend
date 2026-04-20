import { getProvider } from "./registry/payment.registry.js"
import { paymentRepository } from "./payment.repo.js"
import { bookingRepository } from "../bookings/booking.repo.js"

export const createOrderService = async ({
  gateway,
  amount,
  bookingId
}) => {
  const provider = getProvider(gateway)

  const order = await provider.createOrder({ amount, bookingId })

  await paymentRepository.createPayment({
    booking: bookingId,
    provider: gateway,
    orderId: order.orderId,
    amount,

  })
  return order
}

export const confirmPaymentService = async ({
  gateway,
  bookingId,
  data,
}) => {
  const provider = getProvider(gateway)

  const result = await provider.confirmPayment(data)

  if (!result.success) {
    return { success: false }
  }

  await bookingRepository.confirmBooking(
    bookingId,
    result.paymentId
  )
  return {success:true}
}

