import express from 'express'
import { protect } from '../../../middlewares/auth.middleware.js'
import { authorizeRoles } from '../../../middlewares/authorizeRoles.js'
import { createShow, deleteShow, getShowById, getShowsByMovie } from './show.controller.js'

const router = express.Router()

router.post("/", protect, authorizeRoles("admin"), createShow)

router.get("/:id", getShowById);

router.get("/movie/:id", getShowsByMovie);

router.delete("/:id", protect, authorizeRoles("admin"), deleteShow);

export default router