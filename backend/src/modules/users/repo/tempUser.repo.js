import { errorFactory } from "../../../errors/errorFactory.js"
import { TempUser } from "../models/tempUser.model.js"
import { AppError } from "../../../errors/AppErrors.js"
import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { ERROR_CODES } from "../../../errors/errorCodes.js"

export const tempUserRepository = {

  // ================= CREATE =================
  async createTempUser(data) {
    try {
      return await TempUser.create(data)
    } catch (error) {
      throw errorFactory.database.userCreationError()
    }
  },

  // ================= SAVE =================
  async saveTempUser(userDoc) {
    try {
      return await userDoc.save()
    } catch (error) {
      throw new AppError(
        "Failed to save temp user",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.CONFLICT
      )
    }
  },

  // ================= FIND =================
  async findTempUserById(id) {
    try {
      return await TempUser.findById(id)
    } catch (error) {
      throw new Error("Failed to find temp user by ID")
    }
  },

  async findTempUser(query) {
    try {
      return await TempUser.findOne(query)
    } catch (error) {
      throw new Error("Failed to find temp user")
    }
  },
  async findTempUserByEmail(email){
    try {
      return await TempUser.findOne({email})
    } catch (error) {
      throw new Error("Failed to find temp user")
    }
  },
async findTempUserAndUpdate(query, update) {
  try {
    return await TempUser.findOneAndUpdate(
      query,
      update,
      {
        new: true,            // return updated doc
        runValidators: true   // apply schema validation
      }
    )
  } catch (error) {
    throw new Error("Failed to update user")
  }
},

  // ================= DELETE =================
  async deleteTempUser(email) {
    try {
      return await TempUser.deleteOne({email})
    } catch (error) {
      throw new Error("Failed to delete temp user")
    }
  }

}