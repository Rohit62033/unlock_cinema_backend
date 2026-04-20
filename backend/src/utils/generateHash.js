import bcrypt from 'bcrypt'
import crypto from "crypto"

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
const OTP_SECRET = process.env.OTP_SECRET || "default_secret"

// ================= PASSWORD =================
export const passwordHasher = {

  async hash(password) {
    return bcrypt.hash(password, SALT_ROUNDS)
  },

  async compare(password, hash) {
    return bcrypt.compare(password, hash)
  }
}

// ================= OTP =================
export const otpHasher = {

 async hash(otp) {
    return crypto
      .createHmac("sha256", OTP_SECRET) 
      .update(String(otp))
      .digest("hex")
  },

 async verify(otp, hashedOtp) {
    const hashed =await this.hash(otp)
    return hashed === hashedOtp
  }
}