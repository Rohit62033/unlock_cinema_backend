import { errorFactory } from "../../errors/errorFactory.js"
import { generateOtp } from './utils/genreateOtp.js'
import sendOtpEmail from '../../utils/sendEmail.js'
import { tokenService } from './utils/TokenService.js'
import { AppError } from '../../errors/AppErrors.js'
import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { ERROR_CODES } from '../../errors/errorCodes.js'
import { tempUserRepository } from '../users/repo/tempUser.repo.js'
import { userRepository } from '../users/repo/user.repo.js'
import { otpHasher, passwordHasher } from '../../utils/generateHash.js'
import { PasswordResetRepository } from "../users/repo/passwordReset.repo.js"
import { sessionRepository } from "./repo/session.repo.js"


export const verifyOtpService = async ({ email, otp, ip, userAgent }) => {

  const tempUser = await tempUserRepository.findTempUserByEmail(email)  

  if (!tempUser) throw errorFactory.auth.otpInvalid()

  if (tempUser.otpAttempts >= 4) throw errorFactory.auth.otpAttemptsExceeded()

  if (tempUser.otpExpiresAt < new Date()) throw errorFactory.auth.otpExpired()

  const isValid = await otpHasher.verify(otp, tempUser.otp)

  if (!isValid) {
    tempUser.otpAttempts += 1
    await tempUserRepository.saveTempUser(tempUser)
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

  await tempUserRepository.deleteTempUser(email)

  return { user, accessToken, refreshToken }
}

export const registerService = async ({ username, email, password }) => {


  const existingUser = await userRepository.findUserByEmail(email)

  if (existingUser) throw errorFactory.auth.userAlreadyExists()

  const hashedPassword = await passwordHasher.hash(password)


  const otp = generateOtp()
  console.log('ACTUAL GENERATED OTP:', otp);

  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const hashedOtp = await otpHasher.hash(otp)

  let tempUser = await tempUserRepository.findTempUserByEmail(email)

  if (tempUser) {
    tempUser.otp = hashedOtp
    tempUser.otpExpiresAt = otpExpiresAt
    tempUser.otpAttempts = 0
    tempUser.otpResendCount = 0
    await tempUserRepository.saveTempUser(tempUser)
  } else {
    await tempUserRepository.createTempUser({
      email: email,
      username: username,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresAt
    })
  }

  await sendOtpEmail(email, otp)
}

export const loginService = async ({ email, password }) => {

  const user = await userRepository.findByEmailWithPassword(email)

  if (!user) throw errorFactory.auth.userNotFound()

  if (user.failedLoginAttempts >= 3) throw new AppError("User is locked for 24 hours", HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN)

  const isPassMatched = await passwordHasher.compare(password, user.password)

  if (!isPassMatched) {
    user.failedLoginAttempts = user.failedLoginAttempts + 1
    await userRepository.saveUser(user)
    throw errorFactory.auth.invalidCredentials()
  }

  const { accessToken, refreshToken } = tokenService.generateTokens(user._id, user.role)

  if (user.failedLoginAttempts !== 0) {
    user.failedLoginAttempts = 0
    await userRepository.saveUser(user)
  }

  await sessionRepository.createSession({
    user: user._id,
    refreshToken
  })

  return { user, accessToken, refreshToken }
}

export const otpResendService = async ({ email }) => {

  const user = await tempUserRepository.findTempUserByEmail(email)

  if (!user) throw errorFactory.auth.userNotFound()

  if (user.otpResendCount >= 3) throw errorFactory.auth.otpResendLimitExceeded()

  const otp = generateOtp()

  const hashedOtp =await otpHasher.hash(otp)

  await tempUserRepository.findTempUserAndUpdate(
    { email },
    {
      $set: {
        otp: hashedOtp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
      },
      $inc: { otpResendCount: 1 }
    }
  )

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

  sendOtpEmail(email, otp)

  const forgetPasswordUser = await PasswordResetRepository.findPasswordResetByEmail(email)


  if (forgetPasswordUser) {
    forgetPasswordUser.otp = hashedOtp
    forgetPasswordUser.otpCount = forgetPasswordUser.otpCount + 1
    return await PasswordResetRepository.savePasswordReset(forgetPasswordUser)
  } else {

    return await PasswordResetRepository.createPasswordResetUser({
      otp: hashedOtp,
      otpCount: 1,
      email
    })
  }

}

export const resetPasswordService = async (data) => {

  if (data.newPassword !== data.confirmPassword) {
    throw new AppError("Confirm password doesn't match", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)
  }

  const resetUser = await PasswordResetRepository.findPasswordResetByEmail(data.email)

  if (!resetUser) throw new AppError("Invalid request", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)

  if (resetUser.expiresAt < new Date()) throw new AppError("OTP expires", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)

  const isValid = otpHasher.verify(data.otp, resetUser.otp)


  if (!isValid) {
    resetUser.attempts += 1
    PasswordResetRepository.savePasswordReset(resetUser)
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

  await PasswordResetRepository.deletePasswordResetByEmail({ email: data.email })

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