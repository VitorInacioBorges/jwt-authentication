import user_repository from "../../../repositories/user_repository";
import user_model from "../../../models/user_model";

describe("when trying to create an user", () => {
  it("returns the created user", async () => {
    const user = {
      name: "example",
      email: "email@example.com",
      password: "password123",
    };

    const model_created_user = await user_model.create(user);
    const repository_created_user = await user_repository.create(user);

    expect(repository_created_user.email).toBe(
      model_created_user.email.toLowerCase()
    );
  });
});
