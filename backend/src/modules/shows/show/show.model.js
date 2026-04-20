import mongoose from "mongoose"

const showSchema = new mongoose.Schema({

  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie"
  },

  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre"
  },

  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen"
  },

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date
  },

  basePrice: {
    type: Number,
    default: 1
  },

  language: {
    type: String
  },

  format: {
    type: String // 2D, 3D, IMAX
  },
  status: {
    type: String,
    enum: ["scheduled", "cancelled", "completed"],
    default: "scheduled"
  }

}, { timestamps: true })

showSchema.index({ movie: 1, theatre: 1 })

export const Show = mongoose.model("Show", showSchema)