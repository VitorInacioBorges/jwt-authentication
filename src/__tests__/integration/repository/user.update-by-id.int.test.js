import user_model from "../../../models/user_model";
import user_repository from "../../../repositories/user_repository";
import { hashPassword } from "../../../utils/hash_password";

describe("when trying to update an user", () => {
  it("should return an user updated succesfully", async () => {
    const user = {
      name: "example",
      email: "email@example.com",
      password: "password123",
    };

    const created_user = await user_model.create(user);

    const newUser = {
      name: "example",
      email: "email@example.com",
      password: "password123",
    };

    const updated_user = await user_repository.updateById(
      created_user._id,
      newUser
    );

    const found_user = await user_model.findOne(updated_user);

    expect(updated_user).toBeDefined();
    expect(created_user._id).toEqual(updated_user._id);
    expect(found_user).toBeDefined();
    expect(found_user._id).toEqual(created_user._id);
    expect(found_user.name).toBe(created_user.name);
    expect(found_user.email).toBe(created_user.email);
  });
});
