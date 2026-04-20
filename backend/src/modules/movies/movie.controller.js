import { HTTP_STATUS } from '../../constants/httpStatus.js'
import * as movieService from './movie.service.js'

export const createMovie = async (req, res, next) => {
  try {
    const movie = await movieService.createMovie(req.user._id, req.body)

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: movie
    })
  } catch (error) {
    next(error)
  }
}

export const getAllMovies = async (req, res, next) => {
  try {
    const movie = await movieService.getAllMovies(req.query)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      ...movie
    })
  } catch (error) {
    next(error)
  }
}

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body)
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: movie
    })
  } catch (error) {
    next(error)
  }
}

export const getMovieById = async (req, res, next) => {
  try {

    const {id} = req.params
    const movie = await movieService.getMovieById(id)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: movie
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMovie = async (req, res, next) => {
  try {
    await movieService.deleteMovie(req.params.id)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Movie deleted successfully"
    })
  } catch (error) {
    next(error)
  }
}

export const getTrendingMovies = async (req, res, next) => {
  try {
    const movies = movieService.getTrendingMovies()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: movies
    })
  } catch (error) {
    next(error)
  }
}