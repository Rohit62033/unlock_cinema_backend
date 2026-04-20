import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  refreshToken: {
    type: String,
    required: true
  },
  deviceInfo: {
    browser: String, // for now its not implemented
    os: String,
    device: String
  },

  ip: {
    type: String
  },

  isValid: {
    type: Boolean,
    default: true
  },

  expiresAt: {
    type: Date
  }

}, { timestamps: true })


export const Session = mongoose.model("Session", sessionSchema)