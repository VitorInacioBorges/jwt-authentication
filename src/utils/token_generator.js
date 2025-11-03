import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function tokenGenerator(data) {
  const payload = {
    _id: data._id,
    email: data.email,
    role: data.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  return token;
}
