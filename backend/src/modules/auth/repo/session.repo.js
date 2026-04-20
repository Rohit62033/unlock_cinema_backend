import { Session } from "../models/session.model.js"

export const sessionRepository = {
  async findSessionByRefreshToken(token) {
    return await Session.findOne({ refreshToken: token })
  },
  async createSession(sessionDoc) {
    return await Session.create(sessionDoc)
  },

  async invalidate(refreshToken) {
    return await Session.deleteOne({ refreshToken })
  },
  async invalidateAll(userId) {
    try {
      const result = await Session.deleteMany({ user: userId });
      console.log(`Deleted ${result.deletedCount} sessions for user ${userId}.`);
      return result;

    } catch (error) {
      throw new AppError(
        "Failed to save user",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.DATABASE_ERROR
      )
    }
  }
}

