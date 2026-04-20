export const getShowSeatsService = async (showId) => {

  const seats = await ShowSeat.find({ show: showId })
    .sort({ row: 1, seatNumber: 1 });

  return seats;
};

// LOCK SEATS
export const lockSeatsService = async (showId, seatIds, userId) => {

  const result = await ShowSeat.updateMany(
    {
      _id: { $in: seatIds },
      show: showId,
      status: "available"
    },
    {
      $set: {
        status: "locked",
        lockedBy: userId,
        lockedAt: new Date()
      }
    }
  );

  if (result.modifiedCount !== seatIds.length) {
    throw new Error("Some seats already locked/booked");
  }

  return true;
};