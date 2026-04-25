import express from "express"
import { otpLimiter } from "../../middlewares/rateLimitters/otpLimiter.js"
import { changePassword, forgotPassword, getMe, googleAuth, googleCallback, login, logout, logoutAll, otpResend, refreshToken, register, resetPassword, setPassword, verifyOtp } from "./auth.controller.js"
import { protect } from "../../middlewares/auth.middleware.js"
import passport from "passport"
import { validateBody } from "../../middlewares/validate.middleware.js"
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registrationSchema, resetPasswordSchema, sendOtpSchema, setPasswordSchema, verifyOtpSchema } from "./auth.validation.js"

const router = express.Router()
//, otpLimiter
router.post("/register", validateBody(registrationSchema), register)

router.post("/verify-otp", validateBody(verifyOtpSchema), verifyOtp)

router.post("/login", validateBody(loginSchema), login)

router.post("/resend-otp", validateBody(sendOtpSchema), otpResend)

router.post("/refresh-token", refreshToken)

router.get("/me", protect, getMe)

router.post("/set-password", protect, validateBody(setPasswordSchema), setPassword)

router.post("/change-password", protect, validateBody(changePasswordSchema), changePassword)

router.post("/forgot-password", otpLimiter, validateBody(forgotPasswordSchema), forgotPassword)

router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword)

router.post("/logout", protect, logout)

router.post("/logout-all", protect, logoutAll)

router.get("/google", googleAuth)

router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
  }),
  googleCallback
)

export default router