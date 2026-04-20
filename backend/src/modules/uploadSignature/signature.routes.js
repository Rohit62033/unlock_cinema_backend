import express from 'express'
import { protect } from '../../middlewares/auth.middleware.js'
import { authorizeRoles } from '../../middlewares/authorizeRoles.js'
import { getAvatarUploadSignature, getPosterUploadSignature } from './signature.controller.js'

const router = express.Router()

router.get("/poster-signature",protect,authorizeRoles("admin"),getPosterUploadSignature)

router.get("avatar-signature",protect,getAvatarUploadSignature)

export default router