import mongoose from "mongoose"
const bookingSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show"
  },

  seats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowSeat"
    }
  ],

  totalAmount: {
    type: Number
  },

  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  paymentProvider: {
    type: String,
    enum: ["razorpay", "paypal"]
  },

  paymentOrderId: String,   // Razorpay order / PayPal order
  
  paymentId: String,        // Razorpay paymentId / PayPal captureId

  bookingId: {
    type: String,
    unique: true
  },
  

}, { timestamps: true })

bookingSchema.index({ user: 1 });
bookingSchema.index({ show: 1 });

export const Booking = mongoose.model("Booking", bookingSchema)