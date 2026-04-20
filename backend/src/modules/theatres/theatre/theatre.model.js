import mongoose from "mongoose";

const theatreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City"
  },
  address: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
screens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen"
    }
  ]
}, { timestamps: true })

export const Theatre = mongoose.model("Theatre", theatreSchema)