import user_repository from "../../../repositories/user_repository";
import user_model from "../../../models/user_model";

describe("when trying to delete an user", () => {
  it("should return ", async () => {
    const user = {
      name: "example",
      email: "email@example.com",
      password: "password123",
    };

    const created_user = await user_model.create(user);
    const deleted_user = await user_repository.deleteById(created_user._id);

    console.log(created_user);
    console.log(deleted_user);
  });
});
