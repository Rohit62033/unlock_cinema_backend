import express from "express";
import { authorizeRoles } from '../../../middlewares/authorizeRoles.js'
import { createTheatre, getatheatresByCity, getTheatreById, toggleTheatreStatus, updateTheatre } from "./theatre.controller.js";
import { protect } from "../../../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createTheatre);

router.get("/city/:cityId", getatheatresByCity);

router.get("/:theatreid", getTheatreById)

router.put("/thearedId", protect, authorizeRoles("admin"), updateTheatre)

router.patch("/:theatreId/status", protect, authorizeRoles("admin"), toggleTheatreStatus)

export default router;