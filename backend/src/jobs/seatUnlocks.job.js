import cron from "node-cron";
import { ShowSeat } from "../modules/shows/showSeat/showSeat.model.js";

export const startSeatUnlockJob = () => {

  // Runs every 1 minute
  cron.schedule("* * * * *", async () => {
    try {
      console.log("cron starts");

      const result = await ShowSeat.updateMany(
        {
          status: "locked",
          lockedAt: {
            $lt: new Date(Date.now() - 5 * 60 * 1000)
          }
        },
        {
          $set: {
            status: "available",
            lockedBy: null,
            lockedAt: null
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`Unlocked ${result.modifiedCount} seats`);
      }

    } catch (error) {
      console.error("Seat Unlock Cron Error:", error.message);
    }
  });

};