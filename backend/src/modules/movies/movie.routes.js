import express from 'express'
import { authorizeRoles } from '../../middlewares/authorizeRoles.js'
import { protect } from '../../middlewares/auth.middleware.js'
import { createMovie, deleteMovie, getAllMovies, getMovieById, getTrendingMovies, updateMovie } from './movie.controller.js'

const router = express.Router()

//Admin routes
router.post("/", protect, authorizeRoles("admin"), createMovie)
router.put("/:id", protect, authorizeRoles("admin"), updateMovie)
router.delete("/:id", protect, authorizeRoles("admin"), deleteMovie)

//Public route
router.get("/trending-movies", getTrendingMovies)
router.get("/", getAllMovies)
router.get("/:id", getMovieById)

export default router