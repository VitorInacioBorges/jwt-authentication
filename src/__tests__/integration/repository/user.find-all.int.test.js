import user_model from "../../../models/user_model.js";
import user_repository from "../../../repositories/user_repository.js";

describe("when we try to find all users", () => {
  it("returns all users", async () => {
    const user1 = {
      name: "example",
      email: "example@example.com",
      password: "password123",
    };

    const user2 = {
      name: "example2",
      email: "example2@example.com",
      password: "password123",
    };

    const created_user1 = await user_model.create(user1);
    // const created_user2 = await user_model.create(user2);

    const foundAllUsers = await user_repository.findAll();
    console.log(foundAllUsers);

    expect(foundAllUsers).toBe(user1);
  });
});
