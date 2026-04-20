import { HTTP_STATUS } from "../../../constants/httpStatus.js";
import { AppError } from "../../../errors/AppErrors.js";
import { ERROR_CODES } from "../../../errors/errorCodes.js";
import { SeatLayout } from "../../theatres/seatLayout/seatLayout.model.js"
import { ShowSeat } from "../showSeat/showSeat.model.js";
import { Show } from "./show.model.js"

export const createShowService = async (payload) => {
  const show = await Show.create(payload)

  console.log(payload.screen);


  const layout = await SeatLayout.findOne({ screen: payload.screen }).lean();

  if (!layout) {
    throw new AppError("Seat layout not found for this screen", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }

  const calculatePrice = (category, basePrice) => {

    const multiplierMap = {
      Silver: 1,
      Gold: 1.5,
      Platinum: 2
    };

    const multiplier = multiplierMap[category] || 1;

    return Math.round(basePrice * multiplier);
  };

  const showSeats = [];

  // 2. Traverse rows → seats
  for (const row of layout.rows) {
    for (const seat of row.seats) {

      showSeats.push({
        show: show._id,
        seat: seat._id,
        seatNumber: seat.seatNumber,
        row: row.rowName,
        category: seat.category,
        price: calculatePrice(seat.category, payload.basePrice)
      });

    }
  }

  // 3. Bulk insert
  await ShowSeat.insertMany(showSeats);

  return show
}

export const getShowByIdService = async (id) => {
  return await Show.findById(id).populate("movie theatre screen")
}

export const getShowsByMovieService = async (movieId) => {
  return await Show.find({ movie: movieId }).populate("theatre screen")
}

export const deleteShowService = async (showId) => {

const show = await Show.findById(showId)
  if (!show) throw new AppError("Show not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)

    await ShowSeat.deleteMany({show:showId
    })

    await Show.findByIdAndDelete(showId)
}