import user_repository from "../../../repositories/user_repository";
import user_model from "../../../models/user_model";

describe("when trying to find all user", () => {
  it("return all users", async () => {
    const user1 = {
      name: "example",
      email: "email@example.com",
      password: "password123",
    };

    const user2 = {
      name: "example",
      email: "email@example.com",
      password: "password123",
    };

    const created_user1 = await user_model.create(user1);
    const created_user2 = await user_model.create(user1);

    const all_users = await user_repository.findAll();

    expect(Array.isArray(all_users)).toBe(true);

    const emails = all_users.map((x) => x.email.toLowerCase());

    expect(emails).toContain(created_user1.email.toLowerCase());
    expect(emails).toContain(created_user2.email.toLowerCase());
  });
});
