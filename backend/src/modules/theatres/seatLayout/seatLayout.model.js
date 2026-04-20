import mongoose from "mongoose";

const seatLayoutSchema = new mongoose.Schema({
  screen:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Screen"
  },
  rows:[
    {
      rowName:String,
      seats:[
        {
          seatNumber:String,
          category:{
            type:String,
            enum:["Silver", "Gold", "platinum", "Recliner"]
          },
          price:Number
        }
      ]
    }
  ]
},{timestamps:true})

export const SeatLayout = mongoose.model("SeatLayout",seatLayoutSchema)