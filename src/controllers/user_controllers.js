// imports the user_service functions that create the database info
// and create the HTTP request properly

import user_service from "../services/user_service.js";

export default {
  async create(req, res, next) {
    try {
      const user = await user_service.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      // passes the error to the next app.use() function in app.js that accepts 4 parameters
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await user_service.deleteUser(req.params.id);
      res.status(204).json(user);
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const users = await user_service.listUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async get(req, res, next) {
    try {
      const user = await user_service.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const user = await user_service.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      await user_service.loginUser(req.body);
      res.status(201).send({ message: "Login efetuado." });
    } catch (error) {
      next(error);
    }
  },
};
