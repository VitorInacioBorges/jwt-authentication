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

    hashPassword(created_user.password);

    expect(updated_user).toBeDefined();
    expect(created_user._id).toBe(updated_user._id);
    expect(findOne(updated_user)).toStrictEqual(created_user);
  });
});
