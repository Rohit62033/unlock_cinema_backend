import { capturePaypalOrder, createPaypalOrder } from "./paypal.api.js"

export class PaypalProvider {
  async createOrder({amount}){
    const order = await createPaypalOrder(amount)

    return { orderId:order.id}
  }

  async confirmPayment({orderId}){
    const capture = await capturePaypalOrder(orderId)

    return {
      success:capture.status === "COMPLETED",
      paymentId:capture.id
    }
  }
}