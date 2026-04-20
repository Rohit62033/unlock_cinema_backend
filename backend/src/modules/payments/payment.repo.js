import { HTTP_STATUS } from "../../constants/httpStatus.js"
import { AppError } from "../../errors/AppErrors.js"
import { ERROR_CODES } from "../../errors/errorCodes.js"
import { Payment } from "./payment.model.js"

export const paymentRepository ={
  async createPayment(data){
    try {
      return await Payment.create(data)
    } catch (error) {
       console.error("🔥 REAL DB ERROR:", error); 
      throw new AppError("Error while creating payment",HTTP_STATUS.INTERNAL_SERVER_ERROR,ERROR_CODES.DATABASE_ERROR)
    }
  }
}