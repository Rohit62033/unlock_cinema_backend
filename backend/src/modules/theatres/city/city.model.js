import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  state:{
    type:String
  },
    isActive: {
    type: Boolean,
    default: true
  }
},{timestamps:true})

export const City = mongoose.model("City", citySchema)