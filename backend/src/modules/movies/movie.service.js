import { Booking } from '../bookings/booking.model.js'
import { movieRepository } from './repo/movie.repo.js'
import { errorFactory } from '../../errors/errorFactory.js'


export const createMovie = async (userId, data) => {

  console.log(data.title);


  const movieDetails = {
    title: data.title,
    description: data.description,
    genres: data.genres,
    languages: data.languages,
    duration: data.duration,
    releaseDate: data.releaseDate,
    poster: {
      url: data.url,
      public_id: data.public_id,
    },
    certification: data.certification,
    cast: data.cast,
    director: data.director,
    rating: data.rating,
    createdBy: userId
  }

  const movie = await movieRepository.createMovie(movieDetails)
  return movie
}

export const getAllMovies = async (query) => {
  const { limit, search, language, genre } = query

  let { page } = query

  if (!page) page = 1

  const pageNumber = Number(page) || 1
  const limitNumber = Math.min(Number(limit) || 10, 50)

  //Pagination
  const skip = (pageNumber - 1) * limitNumber;

  let filter = {
    isActive: true
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" }
  }

  if (language) {
    filter.languages = language
  }

  if (genre) {
    filter.genres = genre
  }

  const movies = await movieRepository.findMovie(filter, skip, limitNumber)

  const totalMovies = await movieRepository.countMovieDocument(filter)

  return {
    movies,
    totalMovies,
    page: Number(page),
    totalPages: Math.ceil(totalMovies / limitNumber)
  }

}

export const getMovieById = async (id) => {

  const movie = await movieRepository.findMovieById(id)

  if (!movie) throw errorFactory.movie.movieNotFound()

  return movie
}

export const updateMovie = async (id, data) => {

  const allowedUpdates = [
    'title', 'description', 'genres', 'languages',
    'duration', 'releaseDate', 'poster', 'certification',
    'cast', 'director', 'rating', 'isActive'
  ];

  let toUpdate = {}

  // Dynamically build the update object based on received data
  for (const key in data) {
    if (allowedUpdates.includes(key)) {
      toUpdate[key] = data[key];
    }
  }
  console.log(toUpdate);


  const movie = await movieRepository.findMovieByIdAndUpdate(id, toUpdate);


  if (!movie) throw errorFactory.movie.movieNotFound()

  return movie
}

export const deleteMovie = async (id) => {
  const movie = await movieRepository.deleteMovieById(id)

  if (!movie) throw errorFactory.movie.movieNotFound()

  return movie
}

export const getTrendingMovies = async () => {
  const result = await Booking.aggregate([

    // Matching booking that are confirmed
    { $match: { status: "confirmed" } },

    // Join show
    {
      $lookup: {
        from: "shows",
        let: { showId: "$show" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$showId"] }
            },
          },
          {
            $project: {
              movie: 1
            },
          },
        ],
        as: "showData",
      }

    },

    { $unwind: "$showData" },

    //join movie
    {
      $lookup: {
        from: "movies",
        let: { movieId: "$showData.movie" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$movieId"] },

            }
          },
          {
            $project: {
              title: 1,
              poster: 1
            }
          }
        ],
        as: "movieData",
      }
    },
    { $unwind: "$movieData" },

    //seats count
    {
      $addFields: {
        seatCount: {
          $size: { $ifNull: ["$seats", []] },
        }
      }
    },
    //Group
    {
      $group: {
        _id: "$movieData._id",
        title: { $first: "$movieData.title" },
        poster: { $first: "$movieData.poster" },
        totalBooking: { $sum: 1 },
        totalSeatsBooked: { $sum: "$seatCount" },
      }
    },

    {
      $sort: { totalSeatsBooked: -1 },

    },
    { $limit: 10 }
  ])

  
  return result
}