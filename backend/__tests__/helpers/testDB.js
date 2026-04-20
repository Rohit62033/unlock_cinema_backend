// tests/helpers/testDB.js
import mongoose from 'mongoose'

export const connectDB = async () => {
  await mongoose.connect(process.env.TEST_DB_URI)
}

export const clearDB = async () => {
  await mongoose.connection.dropDatabase()
}

export const closeDB = async () => {
  await mongoose.connection.close()
}