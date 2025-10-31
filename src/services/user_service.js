/*
all the business logic is written in this document
a crud interface that allows creation, deletion,
listing and updating
*/

import repo from "../repositories/user_repository.js";
import createError from "../utils/app_error.js";
import hashPassword from "../utils/hash_password.js";

function ensureValidInfo({ name, email, password }) {
  if (!name?.trim()) throw createError("Name cannot be blank.", 400);
  if (!email?.trim()) throw createError("Email cannot be blank.", 400);
  if (!email.includes("@")) throw createError("Email must contain `@`.", 400);
  if (!password?.trim()) throw createError("Password cannot be blank.", 400);
}

export default {
  async createUser(data) {
    ensureValidInfo(data);

    const emailExists = await repo.findByEmail(data.email);
    if (emailExists) {
      throw createError("Email already registered.", 409);
    }

    const hashedPassword = hashPassword(data.password);

    return repo.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
    });
  },

  async listUsers() {
    return repo.findAll();
  },

  async getUser(id) {
    const user = await repo.findById(id);
    if (!user) {
      throw createError("User not found.", 409);
    }
    return user;
  },

  // uses the id of the user to be updated and the new data as arguments
  async updateUser(id, data) {
    const payload = { ...data };

    if(payload.email) {
      if(!payload.email.includes("@")){
        throw createError("Email has to contain `@`", 400);
      }
      const existing = await 
    }
  },

  async deleteUser(id) {
    const user = await repo.deleteById(id);
    if (!user) {
      throw createError("User not found.", 409);
    }
  },
};
