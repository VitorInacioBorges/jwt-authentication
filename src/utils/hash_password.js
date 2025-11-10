/* 
creates a reusable hash function for passwords 
and creates a function to compare passwords based
on bcrypt encryption
*/

import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export function hashPassword(password) {
  return bcrypt.hashSync(password, process.env.BCRYPT_SALT_ROUNDS); // generates a secure hash with a salt of 10
}

export function compareHashedPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}
