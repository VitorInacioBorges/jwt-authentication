import { User } from "../models/user_model.js";

export default {
  create(data) {
    return User.create(data);
  },
  findAll() {
    return User.find();
  },
  findById(id) {
    return User.findById(id);
  },
  updateById(id) {
    return User.findByIdAndUpdate(id);
  },
  deleteById(id) {
    return User.findByIdAndDelete(id);
  },
  findByEmail(email) {
    return User.findOne({ email });
  },
};
