import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { AppError } from "../../../errors/AppErrors.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"
import { screenRepository } from "../screen/screen.repo.js"
import { seatLayoutRepo } from "./seatLayout.repo.js"

export const createSeatLayoutService = async (data) => {
  const screen = await screenRepository.findScreenById(data.screenId
  )

  if (!screen) throw new AppError("Screen not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  const existingLayout = await seatLayoutRepo.findByScreen(screen._id)


  if (existingLayout) {
    throw new AppError(

      "Seat layout already exists for this screen", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST
    );
  }

  const seatSet = new Set();

  for (const row of data.rows) {
    for (const seat of row.seats) {

      if (seatSet.has(seat.seatNumber)) {
        throw new AppError("Duplicate seat number", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST);
      }

      seatSet.add(seat.seatNumber);
    }
  }
  const layout = await seatLayoutRepo.createSeatLayout({
    ...data,
    screen: screen._id,
  });

  return layout

}

export const getSeatLayoutByScreenService = async (screenId) => {
  const layout = await seatLayoutRepo.findByScreen(screenId)

  if (!layout) throw new AppError("Layout not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  return layout
}

export const getSeatLayoutByIdService = async (layoutId) => {

  console.log(layoutId);
  
  const layout = await seatLayoutRepo.findSeatLayoutById(layoutId)

  if (!layout) throw new AppError("Layout not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  return layout
}

export const updateSeatLayoutService = async (id, data) => {
  const updated = await seatLayoutRepo.updateSeatLayoutById(id, data)

  if (!updated) throw new AppError("Layout not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

  return updated
}

export const deleteSeatLayoutService = async (id) => {
  const deleted = await seatLayoutRepo.deleteSeatLayout(id)

  if (!deleted) throw new AppError("Layout not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)
}