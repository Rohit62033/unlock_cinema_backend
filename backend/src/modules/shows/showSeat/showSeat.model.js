import mongoose from "mongoose"

const showSeatSchema = new mongoose.Schema({

  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    index: true
  },

  seat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SeatLayout",
    required: true
  },


  row: String,

  category: {
    type: String
  },

  seatNumber: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["available", "locked", "booked"],
    default: "available",
    index: true
  },

  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  lockExpiresAt: {
    type: Date,
    default: null
  },

  lockedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true })

showSeatSchema.index(
  { show: 1, seatNumber: 1 },
  { unique: true }
);
showSeatSchema.index({ show: 1, status: 1 });
showSeatSchema.index({ lockedBy: 1 });

export const ShowSeat = mongoose.model("ShowSeat", showSeatSchema)