import { Theatre } from "./theatre.model.js"
import { AppError } from '../../../errors/AppErrors.js'
import { HTTP_STATUS } from '../../../constants/httpStatus.js'
import { ERROR_CODES } from '../../../errors/errorCodes.js'

export const theatreRepository = {

  async findTheatreById(id) {
    try {
      return await Theatre.findById(id)
    } catch (error) {
      throw new AppError("Failed to fetch theatre", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)
    }
  },

  async checkDuplicateTheatre(name, cityId) {
    try {
      return await Theatre.findOne({ name, city: cityId })
    } catch (error) {
      throw new AppError(
        "Theatre duplication checking failed",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },

  async findTheatreByCity(cityId) {
    try {
      return await Theatre.find({ city: cityId, isActive: true })
    } catch (error) {

    }
  },

  async createTheatre(data) {
    try {
      return await Theatre.create(data)
    } catch (error) {
      throw new AppError(
        "Failed to create theatre",
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async updateTheatre(id, data) {
    try {
      return await Theatre.findByIdAndUpdate(id, data, { new: true })
    } catch (error) {
      AppError(
        "Failed to update theatre status",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },

  async toggleTheatreStatus(id) {
    try {
      return await Theatre.findByIdAndUpdate(id,
        [
          { $set: { isActive: { $not: "$isActive" } } }
        ], { new: true }
      )
    } catch (error) {
      AppError(
        "Failed to update theatre status",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  

}