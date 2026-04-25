import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from "./src/config/passport.config.js";

// Route Imports
import authRoutes from './src/modules/auth/auth.routes.js';
import movieRoutes from './src/modules/movies/movie.routes.js';
import uploadRoutes from './src/modules/uploadSignature/signature.routes.js';
import cityRoutes from './src/modules/theatres/city/city.routes.js';
import theatreRoutes from './src/modules/theatres/theatre/theatre.routes.js';
import screenRoutes from './src/modules/theatres/screen/screen.routes.js';
import seatLayoutRoutes from './src/modules/theatres/seatLayout/seatLayout.routes.js';
import showRoutes from './src/modules/shows/show/show.routes.js';
import showSeatRoutes from './src/modules/shows/showSeat/showSeat.routes.js';
import bookingRoutes from './src/modules/bookings/booking.routes.js';
import paymentRoutes from './src/modules/payments/payment.routes.js';

// Middleware Imports
import { errorHandler } from './src/middlewares/error.middleware.js';

const app = express();

// --- Middleware Configuration ---
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true 
}));
app.use(passport.initialize());

// --- Route Declarations ---
app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/seat-layouts", seatLayoutRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/show-seat", showSeatRoutes); // Fixed: Added missing leading slash
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// --- Error Handling ---
// Note: errorHandler must be the last middleware added
app.use(errorHandler);

export default app;