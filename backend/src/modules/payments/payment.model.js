import mongoose  from "mongoose";

const paymentSchema = new mongoose.Schema({

  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    index: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  provider: {
    type: String,
    enum: ["RAZORPAY", "PAYPAL"],
    required: true
  },

  orderId: { // Razorpay order_id OR PayPal orderID
    type: String,
    required: true,
    index: true
  },

  paymentId: { // Razorpay payment_id OR PayPal capture ID
    type: String
  },

  signature: { // only for Razorpay
    type: String
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  status: {
    type: String,
    enum: ["CREATED", "SUCCESS", "FAILED"],
    default: "CREATED"
  },

  rawResponse: {
    type: Object // store full gateway response (debug/audit)
  }

}, { timestamps: true })

export const Payment = mongoose.model("Payment", paymentSchema);