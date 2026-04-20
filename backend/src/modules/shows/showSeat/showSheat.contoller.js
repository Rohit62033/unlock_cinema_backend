import { getShowSeatsService, lockSeatsService } from "./showSeat.service.js";

export const getShowSeats = async (req, res, next) => {
  try {
    const seats = await getShowSeatsService(req.params.showId);
    res.json({ success: true, data: seats });
  } catch (err) {
    next(err);
  }
};

export const lockSeats = async (req, res, next) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user._id; // from auth middleware

    await lockSeatsService(showId, seatIds, userId);

    res.json({ success: true, message: "Seats locked successfully" });
  } catch (err) {
    next(err);
  }
};