import cloudinary from "../../config/cloudinary.js"
import { errorFactory } from "../../errors/errorFactory.js"
import { userRepository } from "./repo/user.repo.js"


export const updateProfile = async (userId, data) => {
  const user = await userRepository.findUserById(userId)

  if (!user) throw errorFactory.auth.userNotFound()

  user.name = data.name ?? user.name
  user.avatar = data.avatar ?? user.avatar

  return await userRepository.saveUser(user)
}

export const getUserBooking = async (userId) => {
  return userRepository.getUserBooking(userId)
}

export const getUpcomingBookings = async (userId) => {
  return userRepository.getUpcomingBookings(userId)
}

export const updateAvatar = async (userId, avatarData) => {
  const user = userRepository.findById(userId)
  if (!user) throw errorFactory.auth.userNotFound()

  const oldAvatar = user.avatar

  user.avatar = avatarData

  await userRepository.save(user)

  //Delete old avatar After successful DB update
  if (oldAvatar?.public_id) {
    await cloudinary.uploader.destroy(oldAvatar.public_id)
  }

  return user
}

