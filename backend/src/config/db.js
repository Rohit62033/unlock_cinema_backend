import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/unlockcinema`)
    console.log("DB connected");

  } catch (error) {
    console.log("Mongo conncetion error", error);

  }
}

export default connectDB