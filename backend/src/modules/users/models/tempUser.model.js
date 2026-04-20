import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,

  },

  otpExpiresAt: {
    type: Date,
    default: () => Date.now() + 10 * 60 * 1000,
    index: {
      expires: 0
    }
  },
  otpResendCount: {
    type: Number,
    default: 0
  },
  otpAttempts: {
    type: Number,
    default: 0
  },


},{timestamps:true})

export const TempUser = mongoose.model("TempUser", tempUserSchema)