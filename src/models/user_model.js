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

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", user_schema);
