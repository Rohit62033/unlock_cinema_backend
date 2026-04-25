import { errorFactory } from "../../errors/errorFactory.js"
import { generateOtp } from './utils/genreateOtp.js'
import sendOtpEmail from '../../utils/sendEmail.js'
import { tokenService } from './utils/TokenService.js'
import { AppError } from '../../errors/AppErrors.js'
import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { ERROR_CODES } from '../../errors/errorCodes.js'
import { userRepository } from '../users/repo/user.repo.js'
import { otpHasher, passwordHasher } from '../../utils/generateHash.js'
import { sessionRepository } from "./repo/session.repo.js"
import { redisService } from "../../utils/redisService.js"
import redisClient from "../../config/redisClient.js"


export const verifyOtpService = async ({ email, otp, ip, userAgent }) => {

  const key = `register:${email}`

  const tempUser = await redisService.get(key)

  if (!tempUser) throw errorFactory.auth.otpInvalid()

  if (tempUser.otpAttempts >= 4) throw errorFactory.auth.otpAttemptsExceeded()

  const isValid = await otpHasher.verify(otp, tempUser.otp)

  if (!isValid) {
    // 1. Update the local object
    tempUser.otpAttempts = (tempUser.otpAttempts || 0) + 1;

    await redisClient.set(key, JSON.stringify(tempUser), {
      KEEPTTL: true
    })

    throw errorFactory.auth.otpInvalid()
  }


  const user = await userRepository.createUser({
    username: tempUser.username,
    email: tempUser.email,
    password: tempUser.password,
    authProviders: ["local"],
    isPasswordSet: true
  })

  const { accessToken, refreshToken } = tokenService.generateTokens(user._id, user.role)

  console.log({ ip, userAgent });

  await sessionRepository.createSession({
    user: user._id,
    refreshToken,
    ip
    // ip:rep.ip
  })

  await redisService.del(`register:${email}`)

  return { user, accessToken, refreshToken }
}

export const registerService = async ({ username, email, password }) => {


  const existingUser = await userRepository.findUserByEmail(email)

  if (existingUser) throw errorFactory.auth.userAlreadyExists()

  const hashedPassword = await passwordHasher.hash(password)


  const otp = generateOtp()

  const hashedOtp = await otpHasher.hash(otp)

  const key = `register:${email}`

  const existingTemp = await redisService.get(key)
  let data

  if (existingTemp) {

    data = {
      ...existingTemp,
      otp: hashedOtp,
      otpAttempts: 0,
      otpResendCount: (existingTemp.otpResendCount || 0) + 1,

    }

  } else {
    data = {
      email,
      username,
      password: hashedPassword,
      otp: hashedOtp,
      otpAttempts: 0,
      otpResendCount: 0,
    }
  }

  await redisService.set(key, data, 600)

  await sendOtpEmail(email, otp)
}

export const loginService = async ({ email, password }) => {

  const user = await userRepository.findByEmailWithPassword(email)

  if (!user) throw errorFactory.auth.userNotFound()

  const key = `login_attempts:${email}`
  const attempts = await redisService.incr(key, 86400)

  // if (attempts > 3) throw new AppError("User is locked for 24 hours", HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN)


  const isPassMatched = await passwordHasher.compare(password, user.password)

  if (!isPassMatched)
    throw errorFactory.auth.invalidCredentials()


  const { accessToken, refreshToken } = tokenService.generateTokens(user._id, user.role)

  await sessionRepository.createSession({
    user: user._id,
    refreshToken
  })

  return { user, accessToken, refreshToken }
}

export const otpResendService = async ({ email }) => {

  const key = `register:${email}`

  const user = await redisService.get(key)

  if (!user) throw errorFactory.auth.userNotFound()

  if (user.otpResendCount >= 3) throw errorFactory.auth.otpResendLimitExceeded()

  const otp = generateOtp()

  const hashedOtp = await otpHasher.hash(otp)

  const data = {
    ...user,
    otp: hashedOtp,
    otpResendCount: user.otpResendCount ? user.otpResendCount + 1 : 1
  }

  await redisService.set(key, data, 600)

  await sendOtpEmail(email, otp)
}

export const refreshService = async (refreshToken) => {

  if (!refreshToken) throw errorFactory.auth.unauthorized()

  const session = await sessionRepository.findSessionByRefreshToken(refreshToken)

  if (!session || !session.isValid) throw errorFactory.auth.unauthorized()

  const decoded = tokenService.verifyRefreshToken(refreshToken)

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    tokenService.generateTokens(decoded.userId, decoded.role);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

export const getMeService = async (data) => {

  const user = await userRepository.findUserById(data._id)

  if (!user) throw errorFactory.auth.unauthorized()

  return user
}

export const setPasswordService = async (userId, newPassword) => {

  const user = await userRepository.findUserById(userId)

  if (!user) throw errorFactory.auth.userNotFound()

  if (user.isPasswordSet) {
    throw new AppError("Password already set", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)
  }

  const hashedPassword = await passwordHasher.hash(newPassword)

  user.password = hashedPassword
  user.isPasswordSet = true
  // Add local provider
  if (!user.authProviders.includes("local")) {
    user.authProviders.push("local")
  }

  const result = await userRepository.saveUser(user)

  return result

}

export const changePasswordService = async (userId, data) => {

  const user = await userRepository.findUserByIdWithPassword(userId)

  if (!user) throw errorFactory.auth.userNotFound()

  if (!user.isPasswordSet) throw new AppError("Password not set", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)

  if (data.newPassword === data.currentPassword) throw new AppError("Same password cann't be change", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)

  const isValid = await passwordHasher.compare(data.currentPassword, user.password)

  if (!isValid) throw errorFactory.auth.invalidCredentials()

  const hashedPassword = await passwordHasher.hash(data.newPassword)

  user.password = hashedPassword

  await userRepository.saveUser(user)

  return { message: "Password changed successfully" }

}

export const forgotPasswordService = async (email) => {

  const user = await userRepository.findUserByEmail(email)

  if (!user) throw errorFactory.auth.userNotFound()

  const otp = generateOtp()

  const hashedOtp = await otpHasher.hash(otp)

  const key = `reset:${email}`

  const existing = await redisService.get(key)

  const data = {
    ...user,
    otp: hashedOtp,
    attempts: 0,
    resendCount: existing?.resendCount ? existing.resendCount + 1 : 1
  }

  await redisService.set(key, data, 600)

  await sendOtpEmail(email, otp)

}

export const resetPasswordService = async (data) => {
  const key = `reset:${data.email}`

  if (data.newPassword !== data.confirmPassword) {
    throw new AppError("Confirm password doesn't match", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)
  }

  const resetUser = await redisService.get(key)


  if (!resetUser) throw new AppError("Invalid request", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)

  if ((resetUser.attempts || 0) >= 5) {
    throw errorFactory.auth.otpAttemptsExceeded()
  }

  const isValid = await otpHasher.verify(data.otp, resetUser.otp)


  if (!isValid) {
    resetData.attempts = (resetData.attempts || 0) + 1

    await redisClient.set(key, JSON.stringify(resetData), {
      KEEPTTL: true
    })

    throw errorFactory.auth.otpInvalid()
  }

  const hashedPassword = await passwordHasher.hash(data.newPassword)

  const user = await userRepository.findUserAndUpdate(
    { email: data.email },
    {
      $set: {
        password: hashedPassword,
        isPasswordSet: true
      }
    }
  )

  await sessionRepository.invalidateAll(user._id)

  await redisService.del(key)

  return { message: "Password reset successfully" }
}

export const logoutService = async (refreshToken) => {

  if (!refreshToken) throw errorFactory.auth.unauthorized()

  await sessionRepository.invalidate(refreshToken)

}

export const logoutAllService = async (userId) => {

  console.log(userId);

  await sessionRepository.invalidateAll(userId)
  return { message: 'All devices logout successfully' }
}
export const googleCallbackService = async (returnedState, storedState) => {  

  if (!storedState || storedState !== returnedState) throw errorFactory.auth.invalidOAuthState()

  return
}