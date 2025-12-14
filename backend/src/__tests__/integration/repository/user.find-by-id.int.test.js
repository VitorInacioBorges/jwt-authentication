// integration test for findById method

import user_model from "../../../models/user_model.js";
import user_repository from "../../../repositories/user_repository.js";

describe("when we try to search an user by it's ID", () => {
  it("returns the correct user", async () => {
    const user = {
      name: "find-by-id user",
      email: "findbyid@example.com",
      password: "findbyidsecretpassword",
    };

    const createdUser = await user_model.create(user);

    const foundUser = await user_repository.findById(createdUser._id);

    expect(foundUser).toBeDefined();
    expect(foundUser._id.toString()).toBe(createdUser._id.toString());
    expect(foundUser.email).toBe(user.email.toLowerCase());
  });
});
