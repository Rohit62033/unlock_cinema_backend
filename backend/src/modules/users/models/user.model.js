import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: function () {
        return this.authProviders.includes("local")
      },
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    authProviders: {
      type: [String],
      enum: ["local", "google"],
      default: []
    },
    avatar: {
      url: {
        type: String,
      },
      public_id: {
        type: String
      },
    },

    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    isPasswordSet:{
     type: Boolean,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City"
    },

    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
      }
    ]

  }, { timestamps: true }
)

export const User = mongoose.model("User", userSchema)