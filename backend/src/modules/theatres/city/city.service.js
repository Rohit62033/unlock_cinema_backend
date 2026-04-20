import { HTTP_STATUS } from "../../../constants/httpStatus.js";
import { AppError } from "../../../errors/AppErrors.js";
import { ERROR_CODES } from "../../../errors/errorCodes.js";
import { cityRepo } from "./city.repo.js";

export const createCityService = async (data) => {
  const existing = await cityRepo.findCityByName(data.name);

  if (existing) {
    throw new AppError("City already exists", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST)
  }

  return await cityRepo.createCity(data);
}


export const getCitiesService = async () => {
  return await cityRepo.getAllActiveCities()
}

export const getCityByIdService = async (id) => {
  const city = await cityRepo.findCityById(id)

  if (!city) throw new AppError("City not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  return city
}

export const toggleCityStatusService = async (id) => {
const updated = await cityRepo.toggleCityStatus(id)

if(!updated) throw new AppError("City not found",HTTP_STATUS.NOT_FOUND,ERROR_CODES.NOT_FOUND)

  return updated

}