import mongoose from 'mongoose'
import { jest } from '@jest/globals'

//  DO NOT mock repositories 

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/test_db')
  console.log('Integration DB connected')
})

afterEach(async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.close()
})


// email
await jest.unstable_mockModule('../../src/utils/sendEmail.js', () => ({
  default: jest.fn().mockResolvedValue(true)
}))

// OTP
await jest.unstable_mockModule('../../src/modules/auth/utils/genreateOtp.js', () => ({
  generateOtp: () => '123456'
}))

// optional: disable rate limiter
await jest.unstable_mockModule('../../src/middlewares/rateLimitters/otpLimiter.js', () => ({
  otpLimiter: (req, res, next) => next()
}))