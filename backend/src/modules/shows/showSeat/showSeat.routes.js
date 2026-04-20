import express from "express";

import { protect } from "../../../middlewares/auth.middleware.js";
import { getShowSeats, lockSeats } from "./showSheat.contoller.js";

const router = express.Router();

router.get("/:showId", getShowSeats);
router.post("/lock",protect, lockSeats);

export default router;