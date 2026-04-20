import { HTTP_STATUS } from "../../constants/httpStatus.js"
import { changePasswordService, forgotPasswordService, getMeService, googleCallbackService, loginService, logoutAllService, logoutService, otpResendService, refreshService, registerService, resetPasswordService, setPasswordService, verifyOtpService } from "./auth.service.js"
import { clearAuthCookies, setAuthCookies } from "./utils/cookies.js"
import { generateOAuthState } from '../../utils/generateOAuthState.js'
import { tokenService } from "./utils/TokenService.js"
import passport from "passport"




export const register = async (req, res, next) => {
  try {

    await registerService(req.validatedBody)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "OTP sent"
    })
  } catch (error) {
    next(error)
  }
}

export const verifyOtp = async (req, res, next) => {
  try {

    const { user, refreshToken, accessToken } = await verifyOtpService({ email: req.validatedBody.email, otp: req.validatedBody.otp, ip: req.ip, userAgent: req.headers["user-agent"] })

    setAuthCookies(res, accessToken, refreshToken)

    res.status(HTTP_STATUS.CREATED).json({

      success: true,
      user: {
        username: user.username,
        email: user.email,
        userId: user._id,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {

  try {
    const { user, accessToken, refreshToken } = await loginService(req.validatedBody)


    setAuthCookies(res, accessToken, refreshToken)

    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        userId: user._id,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  try {

    const { accessToken, refreshToken } = await refreshService(req.cookies.refreshToken)

    setAuthCookies(res, accessToken, refreshToken)

    res.status(HTTP_STATUS.OK).json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}

export const otpResend = async (req, res, next) => {
  try {
    await otpResendService(req.validatedBody)

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "OTP resend successfully"
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {

    await logoutService(req.cookies.refreshToken)


    clearAuthCookies(res)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Logged out successfully"
    })
  } catch (error) {
    next(error)
  }
}

export const logoutAll = async (req, res, next) => {
  try {
    const { message } = await logoutAllService(req.user._id)

    clearAuthCookies(res)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {

  try {

    const user = await getMeService(req.user)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        userId: user._id,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    next(error)
  }
}

export const setPassword = async (req, res, next) => {
  try {
    const user = await setPasswordService(req.user._id, req.validatedBody.newPassword)

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Password set successfully",
      user
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {

  try {

    const message = await changePasswordService(req.user._id, req.validatedBody)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    await forgotPasswordService(req.validatedBody.email)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "OTP sent to your email address"
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const message = await resetPasswordService(req.validatedBody)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message
    })
  } catch (error) {
    next(error)
  }
}
export const googleAuth = (req, res, next) => {

  const state = generateOAuthState()

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 5 * 60 * 1000
  })

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state
  })(req, res, next)

}

export const googleCallback = async (req, res, next) => {
  try {
    const storedState = req.cookies.oauth_state
    const returnedState = req.query.state

    await googleCallbackService(returnedState, storedState)

    const user = req.user

    const { accessToken, refreshToken } =
      tokenService.generateTokens(user._id, user.role)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    })

    setAuthCookies

    res.clearCookie("oauth_state")

    res.redirect(`${process.env.CLIENT_URL}`)

  } catch (error) {
    next(error)
  }
}