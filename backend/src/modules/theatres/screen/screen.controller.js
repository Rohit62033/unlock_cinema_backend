import { HTTP_STATUS } from '../../../constants/httpStatus.js'
import * as screenService from './screen.service.js'

export const createScreen = async (req, res, next) => {
  try {
    const data = await screenService.createScreenService(req.body)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const getScreenByTheatre = async (req, res, next) => {
  try {
    const data = await screenService.getScreenByTheatreService(req.params.theatreId)

    res.json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const getScreenById = async (req, res, next) => {
  try {
    const data = await screenService.getScreenByIdService(req.params.screenId, req.body)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const deleteScreen = async (req, res, next) => {
  try {
    await screenService.deleteScreenService(req.params.screenId)

    res.json({
      success:true,
      message:"Screen deleted"
    })

  } catch (error) {
    next(error)
  }

}