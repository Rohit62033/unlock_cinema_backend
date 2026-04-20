import express from 'express'
import { protect } from '../../middlewares/auth.middleware'
import * as userController from "./user.controller.js"
import {
  validateBody,
} from "../../middleware/validate.middleware.js"
import { changePasswordSchema, updateProfileSchema } from './user.validation.js'

const router = express.Router()

router.patch("/change-password", validateBody(changePasswordSchema), protect, userController.changePassword)

router.patch("/update-profile", validateBody(updateProfileSchema), protect, userController.updateProfile)

router.patch("/change-avatar", protect, userController.updateAvatar)

router.get("/bookings", protect, userController.getUserBookings)

router.get("/upcoming-movies", protect, userController.getUpcomingBookings)