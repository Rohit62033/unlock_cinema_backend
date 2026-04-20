import express from "express"
import { createSeatLayout, deleteSeatLayout, getSeatLayoutById, getSeatLayoutByscreen } from "./seatLayout.controller.js"
import { protect } from '../../../middlewares/auth.middleware.js'
import { authorizeRoles } from "../../../middlewares/authorizeRoles.js"

const router = express.Router()

router.post('/', protect, authorizeRoles("admin"), createSeatLayout)

router.get("/screen/:screenId", getSeatLayoutByscreen)

router.get("/:layoutId", getSeatLayoutById)


router.delete("/:layoutId", protect, authorizeRoles("admin"), deleteSeatLayout)

export default router