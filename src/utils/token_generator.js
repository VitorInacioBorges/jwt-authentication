import jwt from "jsonwebtoken";
import user from "../models/user_model.js";
import dotenv from "dotenv";

dotenv.config();

export default function tokenGenerator(data) {
  const payload = { ...data };
  const token = jwt.sign(payload._id, payload.email, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}
