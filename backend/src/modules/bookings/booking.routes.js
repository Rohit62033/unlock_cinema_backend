import express from 'express'
import { protect } from '../../middlewares/auth.middleware.js'
import { cancelBooking, getBookingById, getMyBooking, initiateBooking } from './booking.controller.js'

const router = express.Router()

router.post('/initiate',protect,initiateBooking)

router.get("/my",protect, getMyBooking)

router.get("/:bookingId", protect, getBookingById)

router.post("/:id/cancel", protect, cancelBooking)

export default router