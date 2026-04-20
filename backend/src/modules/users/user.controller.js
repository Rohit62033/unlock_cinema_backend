import { success } from "zod"
import { HTTP_STATUS } from "../../constants/httpStatus"
import cloudinary from "../../config/cloudinary.js"

import * as userService from './user.service.js'




export const getUserBookings = async (req, res, next) => {
  try {
    const booking = await userService.getUserBooking(req.user.id)

    res.json(HTTP_STATUS.OK).json({
      success: true,
      data: booking
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const user = await updateProfileService(req.user._id, req.body)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Profile updated",
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const getUpcomingBookings = async (req, res, next) => {
  try {
    const upcomingBooking = await userService.getUpcomingBookings(req.user.id)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: upcomingBooking
    })
  } catch (error) {
    next(error)
  }
}

export const updateAvatar = async (req, res, next) => {

  const { url, public_id } = req.body.avatar
  if (!url || !public_id) {
    return res.status(HTTP_STATUS).json({
      success: false,
      message: "Invalid avatar data"
    })
  }

  try {
    const user = await userService.updateAvatar(req.user.id,
      { url, public_id }
    )

    res.status(HTTP_STATUS.OK).json({
      success:true,
      data:user
    })
  } catch (error) {
    //Rollback
    await cloudinary.uploader.destroy(public_id)
    next(error)
  }
}