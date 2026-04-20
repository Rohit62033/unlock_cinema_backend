import { HTTP_STATUS } from '../../../constants/httpStatus.js'
import { AppError } from '../../../errors/AppErrors.js'
import { ERROR_CODES } from '../../../errors/errorCodes.js'
import { Screen } from './screen.model.js'

export const screenRepository = {
  async createScreen(data) {
    try {
      return await Screen.create(data)
    } catch (error) {
      throw new AppError("Failed to fetch theatre", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)
    }
  },
  async findScreenById(screenId) {
    try {
      return await Screen.findById(screenId).populate("seatLayout").lean()
    } catch (error) {
      throw new AppError("Failed to find the screen by id", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.DATABASE_ERROR)
    }
  },
  async findScreenByTheatreId(thearedId) {
    try {
      return await Screen.find({theatre:thearedId})
    } catch (error) {
      throw new AppError("Failed to find theatre", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)
    }
  },

  async findDuplicateScreen(name,theatre){
    try {
      return await Screen.findOne({name, theatre})
    } catch (error) {
    AppError(
        "Failed to fetch duplicate screen",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async updateScreen(id, data){
try {
  return await Screen.findByIdAndUpdate(id,data,{new:true})
} catch (error) {
   AppError(
        "Failed to update screen",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
}
  },
  async deleteScreen(id){
    try {
      return await Screen.findByIdAndDelete(id)
    } catch (error) {
       AppError(
        "Failed to delete screen",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  }
}