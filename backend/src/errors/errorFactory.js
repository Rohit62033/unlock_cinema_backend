import { validationErrors } from "./factories/validationErrors.js"
import { databaseErrors } from "./factories/databaseErrors.js"
import { authErrors } from "./factories/authErrors.js"
import { paymentErrors } from "./factories/paymentErrors.js"
import { bookingErrors } from "./factories/bookingErrors.js"
import { movieErrors } from "./factories/movieErrors.js"

export const errorFactory = {

  validation: validationErrors,

  database: databaseErrors,

  auth: authErrors,

  payment: paymentErrors,

  booking: bookingErrors,

  movie: movieErrors
}