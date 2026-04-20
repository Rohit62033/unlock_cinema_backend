import jwt from 'jsonwebtoken'
import { User } from '../modules/users/models/user.model.js'
import { errorFactory } from '../errors/errorFactory.js'
import { tokenService } from '../modules/auth/utils/TokenService.js'

export const protect = async (req, res, next) => {
  const token = req.cookies.accessToken

  console.log(token);
  

  if (!token) throw errorFactory.auth.unauthorized()

  try {

    const decoded = tokenService.verifyAccessToken(token)

    console.log(decoded);


    const user = await User.findById(decoded.userId)


    if (!user) throw errorFactory.auth.userNotFound()

    req.user = user
    console.log("user set");

    next()
  } catch (error) {
    console.log("Reauthentication failed");

    next(error)
  }
}