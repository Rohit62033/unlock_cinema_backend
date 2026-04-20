import express from 'express'
import { createCity, getCities, getCityById } from './city.controller.js'
import { authorizeRoles } from '../../../middlewares/authorizeRoles.js'
import { protect } from '../../../middlewares/auth.middleware.js'

const router = express.Router()

router.post("/",
  protect, authorizeRoles("admin"), createCity)

router.get("/", getCities)

router.get("/:cityId", getCityById)

export default router