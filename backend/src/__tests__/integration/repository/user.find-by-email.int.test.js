import user_model from "../../../models/user_model.js";
import user_repository from "../../../repositories/user_repository.js";

describe("when we try to search an user by it's email", () => {
  it("returns the correct user", async () => {
    const user = {
      name: "exampleName",
      email: "findbyemail@example.com",
      password: "supersecretpassword",
    };

    const createdUser = await user_model.create(user);

    const foundUser = await user_repository.findByEmail(createdUser.email);

    expect(foundUser).toBeDefined();
    expect(foundUser.email).toBe(createdUser.email.toLowerCase());
    expect(foundUser.email).toBe(user.email.toLowerCase());
  });
});
