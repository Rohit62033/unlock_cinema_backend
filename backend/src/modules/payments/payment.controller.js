import { HTTP_STATUS } from "../../constants/httpStatus.js"
import { confirmPaymentService, createOrderService } from "./payment.service.js"

export const createOrder = async (req, res, next) => {

  try {
    const { gateway, amount, bookingId } = req.body

    const order = await createOrderService({ gateway, amount, bookingId })

    res.json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

export const verifyPayment = async (req, res, next) => {
  try {
    const { gateway, bookingId, data } = req.body

    const result = await confirmPaymentService({
      gateway,
      bookingId,
      data
    })

    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false
      })
    }

    res.json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}