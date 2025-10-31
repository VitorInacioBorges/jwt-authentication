/*
all the business logic is written in this document
a crud interface that allows creation, deletion,
listing and updating
*/

import repo from "../repositories/user_repository.js";
import createError from "../utils/app_error.js";
import hashPassword from "../utils/hash_password.js";

// ensures that every property is valid
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
      throw createError("User not found.", 404);
    }
    return user;
  },

  // uses the id of the user to be updated and the new data as arguments
  async updateUser(id, data) {
    // asigns payload as complete data object (all properties)
    const payload = { ...data };

    // checks if email exists
    if (payload.email) {
      // if it does then checks if it is valid
      if (!payload.email.includes("@")) {
        throw createError("Invalid email", 400);
      }
      // checks to see if the new email already exists and it's not the same as the old one
      const existing = await repo.findByEmail(payload.email);
      if (existing && existing.id !== id) {
        throw createError("Email already registered.", 409);
      }
      payload.email = payload.email.toLowerCase();
    }

    if (payload.name) {
      payload.name = payload.name.toLowerCase();
    }

    // transforms the properties of payload object in an array of keys
    // checks if the array has any properties undefined
    // if it has then the program deletes it
    Objects.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    // if the array of keys has no elements than it throws an error
    if (Objects.keys(payload).length() === 0) {
      throw createError("No field completed for updating.", 400);
    }

    const updated = await repo.updateById(id, payload);
    if (!updated) {
      throw createError("User not found.", 404);
    }
    return updated;
  },

  async deleteUser(id) {
    const user = await repo.deleteById(id);
    if (!user) {
      throw createError("User not found.", 404);
    }
  },
};
