import mongoose from "mongoose"
import { nanoid } from "nanoid";
import { ShowSeat } from '../shows/showSeat/showSeat.model.js'
import { AppError } from "../../errors/AppErrors.js";
import { Booking } from "./booking.model.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";

export const initiateBookingService = async (userId, showId, seatIds) => {

  const session = await mongoose.startSession();

  session.startTransaction()

  const objectSeatIds = seatIds.map(id => new mongoose.Types.ObjectId(id));
  
  try {

    //Atomic seat lock 
    const result = await ShowSeat.updateMany(
      {
        seat: { $in: objectSeatIds },
        show: showId,
        $or: [
          { status: "available" },
          {
            status: "locked",
            $or: [
              { lockExpiresAt: { $lt: new Date() } },
              { lockExpiresAt: null }
            ]

          }
        ]
      },
      {
        $set: {
          status: "locked",
          lockedBy: userId,
          lockedAt: Date.now(),
          lockExpiresAt: new Date(Date.now() + 5 * 60 * 1000)
        }
      },
      { session })



    if (result.modifiedCount !== seatIds.length) throw new AppError("Some seats are already booked/locked", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT)

    //calculate total amount 

    const seats = await ShowSeat.find({
      seat: { $in: seatIds },
      show: showId
    }).session(session)

    const totalAmount = seats.reduce((sum, s) => sum + s.price, 0)    

    //create booking
    const booking = await Booking.create([{
      user: userId,
      show: showId,
      seats: seatIds,
      totalAmount,
      bookingStatus: "pending",
      paymentStatus: "pending",
      bookingId: nanoid(10)
    }], { session });

    await session.commitTransaction()

    return booking[0]

  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export const getMyBookingService = async (userId) => {
  return Booking.find({ user: userId })
    .sort({ created: -1 })
    .populate("show")
    .populate("seats")
}

export const getBookingByIdService = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate("show")
    .populate("seats")

  if (!booking) throw AppError("Booking not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  return booking

}

export const cancelBookingService = async (bookingId) => {
  const session = await mongoose.startSession()

  try {
    const booking = await Booking.findById(bookingId).session(session)

    if (!booking) throw AppError("Booking not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

    if (booking.bookingStatus === "confirmed") throw AppError("Cannot cancel confirmed booking", HTTP_STATUS.SERVICE_UNAVAILABLE, ERROR_CODES.SERVICE_UNAVAILABLE)

    booking.bookingStatus = "cancelled"
    booking.paymentStatus = "failed"
    await booking.sace({ session })

    await ShowSeat.updateMany(
      { _id: { $in: booking.seats } },
      {
        $set: {
          isLocked: false,
          lockedBy: null
        }
      },
      { session }
    )

    await session.commitTransaction()

    return booking

  } catch (error) {
    await session.abortTransaction()
  } finally {
    session.endSession()
  }
}