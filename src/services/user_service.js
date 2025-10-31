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
  async createUser(data) {},

  async listUsers() {},

  async getUser(id) {},

  async updateUser(id) {},

  async deleteUser(id) {},
};
