import { HTTP_STATUS } from '../../constants/httpStatus.js'
import * as bookingService from './booking.service.js'

export const initiateBooking = async (req, res, next) => {
  try {
    const { showId, seatIds } = req.body
    const userId = req.user._id

    const booking = await bookingService.initiateBookingService(userId, showId, seatIds)
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: booking
    })
  } catch (error) {
    next(error)
  }
}

export const getMyBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getMyBookingService(req.user._id)

    res.json({
      success: true,
      data: booking
    })
  } catch (error) {
    next(error)
  }
}

export const getBookingById = async (req, res, next) => {
  try {

    const booking = await bookingService.getBookingByIdService(req.params.bookingId)

    res.json({
      success: true,
      data: booking
    })
  } catch (error) {
    next(error)
  }
}

export const cancelBooking = async (req, res, next) => {

  try {
    const booking = await bookingService.cancelBookingService(req.params.bookingId)

    res.json({
      success: true,
      data: booking

    })
  } catch (error) {
    next(error)
  }

}