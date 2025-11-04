import mongoose from "mongoose";

const user_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: [String],
      enum: ["USER", "ADMIN"],
      default: ["USER"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", user_schema);
