import { HTTP_STATUS } from '../../../constants/httpStatus.js'
import * as seatLayoutService from './seatLayout.service.js'


export const createSeatLayout = async (req, res, next) => {
  try {
    const data = await seatLayoutService.createSeatLayoutService(req.body)
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const getSeatLayoutByscreen = async (req, res, next) => {
  try {
    const data = await seatLayoutService.getSeatLayoutByScreenService(req.params.screenId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const getSeatLayoutById = async (req, res, next) => {
  try {

    console.log(req.params.layoutId);
    

    const data = await seatLayoutService.getSeatLayoutByIdService(req.params.layoutId)

    res.json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const updateSeatLayout = async (req, res, next) => {
  try {
    const data = await seatLayoutService.updateSeatLayoutService(req.params.layoutId, req.body)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSeatLayout = async (req, res, next) => {
  try {
    await seatLayoutService.deleteSeatLayoutService(req.params.layoutId)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Deleted successfully"
    })
  } catch (error) {
    next(error)
  }
}