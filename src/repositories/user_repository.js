// manages mongoose saving and editing functions to better management

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
  updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    // new and runValidators properties
    // new: true             -> return the updated document
    // runValidators: true   -> runs mongoose schema validators during the update
  },
  deleteById(id) {
    return User.findByIdAndDelete(id);
  },
  findByEmail(email) {
    return User.findOne({ email });
  },
};
