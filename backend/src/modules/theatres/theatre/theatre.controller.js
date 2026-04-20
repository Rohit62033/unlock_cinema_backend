import { HTTP_STATUS } from '../../../constants/httpStatus.js'
import * as theatreService from './theatre.service.js'


export const createTheatre = async (req, res, next) => {

  try {
    const result = await theatreService.createTheatreService(req.body)

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getatheatresByCity = async (req, res, next) => {
  try {
    const result = await theatreService.getTheatresByCityService(req.params.cityId)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getTheatreById = async (req, res, next) => {
  try {
    const data = await theatreService.getTheatreByIdService(req.params.theatreId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const updateTheatre = async (req, res, next) => {
  try {
    const data = await theatreService.toggleTheatreStatusService(req.params.theatreId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const toggleTheatreStatus = async (req, res, next) => {
  try {
    const data = await theatreService.toggleTheatreStatusService(req.params.theatreId)

    res.json({ success: true, data });
  } catch (error) {
    next(error)
  }

}