export class RazorpayProvider {
  async createOrder({ amount, bookingId }) {
    const order = await RazorpayProvider.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: bookingId,
    })
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    }
  }

  async confirmPayment(data) {
    const isValid = verifySignature(data)

    return {
      success: isValid,
      paymentId: data.razorpay_payment_id,
    }
  }

}