import mongoose from "mongoose";

const PasswordResetSchema = mongoose.Schema({
  email: {
    type:String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  otp: {
    type: String,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 10 * 60 * 1000,
    index: {
      expires: 0
    }
  },
  otpAttempts: {
    type: Number,
    default: 0
  },
  otpCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema)