import mongoose from "mongoose"
import dotenv from "dotenv"

import { Movie } from "../src/modules/movies/movie.model.js"
import Show from "../src/modules/shows/models/show.model.js"

import { moviesData } from "./movies.js"
import { generateShows } from "./show.js"

dotenv.config()


const seedDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/unlockcinema`)
    console.log("✅ DB Connected")

    // 🔥 Clean DB (optional but recommended for dev)
    await Movie.deleteMany()
    await Show.deleteMany()

    console.log("🧹 Old data cleared")

    // 🔹 Insert Movies
    const insertedMovies = await Movie.insertMany(moviesData)
    console.log("🎬 Movies inserted:", insertedMovies.length)

    // 🔹 Dummy theatre + screen IDs (replace with real later)
    const dummyTheatres = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ]

    const dummyScreens = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ]

    // 🔹 Generate Shows
    const showsData = generateShows(
      insertedMovies,
      dummyTheatres,
      dummyScreens
    )

    const insertedShows = await Show.insertMany(showsData)

    console.log("🎥 Shows inserted:", insertedShows.length)

    console.log("🚀 Seeding completed successfully")
    process.exit()

  } catch (error) {
    console.error("❌ Error in seeding:", error)
    process.exit(1)
  }
}

seedDB()