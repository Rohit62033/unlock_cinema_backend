import multer from "multer";

const storage = multer.diskStorage()

export const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024
  },
  fileFilter: (req, res, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only images are allowed"), false)
    }
  }
})