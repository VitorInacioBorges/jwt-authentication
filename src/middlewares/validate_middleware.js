import mongoose from "mongoose";
import createError from "../utils/app_error.js";

export function ensureValidId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw createError("Invalid ID.", 400);
  }
  next();
}
