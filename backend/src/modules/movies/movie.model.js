import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    description: {
      trpe: String
    },
    genres: [
      { type: String }
    ],
    languages: [
      {
        type: String,
        required: true
      }
    ],
    duration: {
      type: Number,
      required: true
    },
    releaseDate: {
      type: Date,
      required: true
    },
    poster: {
      url: String,
      public_id: String,
    },
    certification: {
      type: String // U, UA, A
    },
    cast: [
      {
        name: String,
        role: String,
        profileImage: String
      }
    ],
    director: [
      { type: String }
    ],
    rating: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }, createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },

  { timestamps: true }

)
movieSchema.index({ title: "text" });

export const Movie = mongoose.model("Movie", movieSchema) 