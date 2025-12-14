import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function tokenGenerator(data) {
  const payload = {
    _id: data._id,
    email: data.email,
    role: data.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}

export function tokenValidation(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}
