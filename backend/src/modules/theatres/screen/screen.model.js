import mongoose from "mongoose"

const screenSchema = new mongoose.Schema({
  theatre:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Theatre"
  },
  name:{
    type:String
  },
  totalSeats:{
    type:Number
  },
  seatLayout:{
    type:mongoose.Types.ObjectId,
    ref:"SeatLayout"
  }
},{timestamps:true})

export const Screen = mongoose.model("Screen",screenSchema) 