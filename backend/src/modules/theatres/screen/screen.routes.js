import express from 'express'
import { createScreen, deleteScreen, getScreenById, getScreenByTheatre } from './screen.controller.js'
import { updateTheatre } from '../theatre/theatre.controller.js'

const router = express.Router()

router.post("/", createScreen)

router.get("/theatre/:theatreId", getScreenByTheatre)

router.get("/:screenId", getScreenById)

router.put("/:screenId", updateTheatre)

router.delete("/:screenId", deleteScreen)

export default router