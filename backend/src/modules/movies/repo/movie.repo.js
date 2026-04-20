import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { AppError } from "../../../errors/AppErrors.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"
import { Movie } from "../movie.model.js"
import { deleteMovie } from "../movie.service.js"

export const movieRepository = {
  async createMovie(data) {
    try {
      return await Movie.create(data)

    } catch (error) {
      throw new AppError(
        "Failed to create movie",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async findMovieById(id) {
    try {
      return await Movie.findById(id)
    } catch (error) {
      throw new AppError(
        "Failed to fetch movie",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async findMovie(filter, skip, limitNumber) {
    try {
      return await Movie
        .find(filter)
        .skip(skip)
        .limitNumber(limitNumber)
        .sort({ created: -1 })
    } catch (error) {
      throw new AppError(
        "Failed to find movie",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async countMovieDocument(filter) {
    try {
      return await Movie.countDocuments(filter)
    } catch (error) {
      throw new AppError(
        "Failed to count  movie",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async findMovieByIdAndUpdate(id, toUpdate) {
    try {
      return await Movie.findByIdAndUpdate(id, toUpdate, { new: true })
    } catch (error) {
      throw new AppError(
        "Failed to update movie",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  },
  async deleteMovieById(id) {
    try {
      return await Movie.findByIdAndUpdate(id, { $set: { isActive: false } })
    } catch (error) {
      throw new AppError(
        "Failed to delete movie",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  }
}