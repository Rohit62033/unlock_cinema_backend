import app from './app.js';
import connectDB from './src/config/db.js';
import { connectRedis } from './src/config/redisClient.js';
import { startSeatUnlockJob } from "./src/jobs/seatUnlocks.job.js";

const PORT = process.env.PORT || 3000;

/**
 * Bootstraps the application.
 * Ensures Database is connected before the server starts listening.
 */
const bootstrap = async () => {
  try {

    // 1. Connect to Database
    await connectDB();
    await connectRedis()

    // 2. Start Background Jobs
    startSeatUnlockJob();
    console.log('Background jobs initialized');

    // 3. Start Listening
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Critical failure during startup:');
    console.error(error);
    process.exit(1); // Exit process with failure code
  }
};

bootstrap();
