// controllers/upload.controller.js
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../../errors/AppErrors.js";

export const getPosterUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "movies",
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [
          { width: 500, height: 700, crop: "limit" }
        ],
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_API_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
    });
  } catch (err) {

    return new AppError("Signature Error", 500, "Internal Server Error")
  }
};

export const getAvatarUploadSignature = async (req, res, next) => {
try {
     const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "avatars",
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
    });
} catch (error) {
   return new AppError("Signature Error", 500, "Internal Server Error")
}
}