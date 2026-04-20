import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { AppError } from "../../../errors/AppErrors.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"
import { cityRepo } from "../city/city.repo.js"
import { Theatre } from "./theatre.model.js"
import { theatreRepository } from "./theatre.repo.js"

export const createTheatreService = async (data) => {
  const city = await cityRepo.findCityByName(data.cityName)


  if (!city) throw new AppError("City not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  const duplicate = await theatreRepository.checkDuplicateTheatre(data.name, city._id)


  if (duplicate) throw new AppError("Theatre already exists in city", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)

  const details = {
    name: data.theatreName,
    city: city._id,
    address: data.address,

  }

  return await theatreRepository.createTheatre(details)
}

export const getTheatresByCityService = async (cityId) => {
  const theatres = await theatreRepository.findTheatreByCity(cityId)

  if (!theatres.length) throw new AppError("No theatre found", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)

  return theatres
}

export const getTheatreByIdService = async (id) => {
  const theatre = await theatreRepository.findTheatreById(id)

  if (!theatre) throw new AppError("Theatre not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  return theatre
}

export const updateTheatreService = async (id, data) => {
  const updated = await theatreRepository.updateTheatre(id, data)

  if (!updated) throw new AppError("Theatre not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  return updated
}

export const toggleTheatreStatusService = async (id) => {

  const updated = await theatreRepository.toggleTheatreStatus(id)

  if (!updated) throw new AppError("Theatre not found ", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  return updated
}
















