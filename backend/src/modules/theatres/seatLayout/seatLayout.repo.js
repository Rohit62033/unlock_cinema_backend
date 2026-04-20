import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { AppError } from "../../../errors/AppErrors.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"
import { SeatLayout } from "./seatLayout.model.js"


export const seatLayoutRepo = {
  async createSeatLayout(data) {
    try {
      return await SeatLayout.create(data)

    } catch (error) {
      throw new AppError(
        "Failed to create screen",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async findByScreen(screenId) {
    try {
      return await SeatLayout.findOne({ screen: screenId }).lean()
    } catch (error) {
      throw new AppError(
        "Failed to fetch screen",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async deleteScreenById(id) {
    try {
      return await SeatLayout.findByIdAndDelete(id)
    } catch (error) {
      throw new AppError(
        "Failed to delete screen",
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async updateSeatLayoutById(id, data) {
    try {
      return await SeatLayout.findByIdAndUpdate(id, data, { new: true })
    } catch (error) {
      AppError(
        "Failed to update seat Layout ",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async deleteSeatLayout(id){
    try {
      return await SeatLayout.findByIdAndDelete(id)
    } catch (error) {
       AppError(
        "Failed to delete seat layout",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async findSeatLayoutById (id){
    try {
      return await SeatLayout.findById(id)
    } catch (error) {
       AppError(
        "Failed to fetch seat layout by id",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  }
}