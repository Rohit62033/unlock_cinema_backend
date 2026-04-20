import { AppError } from "../AppErrors.js"
import { ERROR_CODES } from "../errorCodes.js"
import { HTTP_STATUS } from '../../../src/constants/httpStatus.js'

export const movieErrors = {

   movieNotFound(){
    return AppError (
      "No movie found",
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NO_MOVIE_FOUND
    )
  }
}