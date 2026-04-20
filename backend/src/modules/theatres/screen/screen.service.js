import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { AppError } from "../../../errors/AppErrors.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"
import { theatreRepository } from "../theatre/theatre.repo.js"
import { screenRepository } from "./screen.repo.js"

export const createScreenService = async (data) => {
  const theatre = await theatreRepository.findTheatreById(data.theatre)

  if (!theatre) throw new AppError("Theatre not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  const duplicate = await screenRepository.findDuplicateScreen(data.name, data.theatre)

  console.log(duplicate);
  
  if (duplicate) throw new AppError("Screen already exists in this theatre", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)

  return await screenRepository.createScreen(data)

}

export const getScreenByTheatreService = (id) => screenRepository.findScreenByTheatreId(id)

export const getScreenByIdService = async (id) => {
  
  
  const screen = await screenRepository.findScreenById(id)

  if (!screen) throw new AppError(
    "No screen found",
    HTTP_STATUS.CONFLICT,
    ERROR_CODES.DATABASE_ERROR
  )

  return screen
}

export const deleteScreenService = async (id) => {
  const deleted = await theatreRepository.deleteScreenService(id)

  if (!deleted) throw new AppError(
    "Failed to delete screen",
    HTTP_STATUS.CONFLICT,
    ERROR_CODES.DATABASE_ERROR
  )

  return deleted
}
