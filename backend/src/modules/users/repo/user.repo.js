import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { AppError } from "../../../errors/AppErrors.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"
import { Booking } from "../../bookings/booking.model.js"
import { User } from "../models/user.model.js"

export const userRepository = {

  // ================= SAVE =================
  async saveUser(userDoc) {
    try {
      return await userDoc.save()
    } catch (error) {
      throw new AppError(
        "Failed to save user",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },

  // ================= CREATE =================
  async createUser(data) {
    try {
      return await User.create(data)
    } catch (error) {
      throw new AppError(
        "Failed to save user",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },

  // ================= FIND =================
  async findUserById(id) {
    try {
      return await User.findById(id)
    } catch (error) {
      throw new AppError(
        "Failed to find user by ID",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async findUserByIdWithPassword(id){
try {
      return await User.findById(id).select("+password")
    } catch (error) {
      throw new AppError(
        "Failed to find user by ID",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },

  async findUserByEmail(email) {
    try {
      return await User.findOne({ email })
    } catch (error) {
      throw new AppError(
        "Failed to find user by email",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async findByEmailWithPassword(email) {
    try {
      return await User.findOne({ email }).select("+password")
    } catch (error) {
      throw new AppError(
        "Failed to find user with password",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async findUserAndUpdate(query, update) {
    try {
      return await User.findOneAndUpdate(
        query,
        update,
        {
          new: true,            // return updated doc
          runValidators: true   // apply schema validation
        }
      )
    } catch (error) {
      throw new Error("Failed to update user")
    }
  },

  // ================= BOOKINGS =================
  async getUpcomingBookings(userId) {
    return Booking.find({
      user: userId,
      showTime: { $gte: new Date() }
    })
  },

  async getUserBooking(userId) {
    return Booking.find({
      user: userId
    })
      .populate({
        path: "show",
        select: "startTime movie theatre",
        populate: [
          {
            path: "movie",
            select: "title poster"
          },
          {
            path: "theatre",
            select: "name city"
          }
        ]
      })
      .populate({
        path: "showSeat",
        select: "seatNumber price"
      })
      .sort({ created: -1 })
  }
}