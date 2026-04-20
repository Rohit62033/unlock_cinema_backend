import { HTTP_STATUS } from '../../../constants/httpStatus.js'
import * as cityService from './city.service.js'

export const createCity = async(req , res , next)=>{
  try {
    const data  = await cityService.createCityService(req.body)

    res.status(HTTP_STATUS.CREATED).json({
      success:true,
      data
    })
  } catch (error) {
    next(error)
  }
}

export const getCities = async(req, res,next)=>{
 try {
  const data = await cityService.getCitiesService()

  res.status(HTTP_STATUS.OK).json({
    success:true,
    data
  })
 } catch (error) {
  next(error)
 }
}

export const getCityById = async(req, res, next)=>{
 try {
   const data = await cityService.getCityByIdService(req.params.cityId)

  res.json({
    success:true,
    data
  })
 } catch (error) {
  next(error)
 }
}

export const toggleCityStatus = async(req, res, next)=>{
  const data = await cityService.toggleCityStatusService(req.params.cityid)

  res.json({
    success:true,
    data
  })
}