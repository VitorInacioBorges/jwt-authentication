import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// TODO consertar o payload que precisa de _id quando for fazer o token

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

export function tokenValidation(data) {
  const payload = {
    _id: data._id,
    email: data.email,
    role: data.role,
  };

  return jwt.verify(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}
