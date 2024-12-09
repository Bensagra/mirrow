import { userControllers } from "../user_controllers";
import { prismaMock } from "../../singelton";
import { jest } from "@jest/globals";
import * as jwtControllers from "../../utilities/jwt";


jest.mock("../../utilities/emailVerification");
jest.mock("../../utilities/passwordReset");

describe("userControllers.login", () => {
  it("debería autenticar a un usuario correctamente", async () => {
    const req = { body: { email: "test@example.com", password: "password123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: "Test",
      surname: "User",
      email: "test@example.com",
      password: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6InBhc3N3b3JkMTIzIiwiaWF0IjoxNzMzNDU0ODQ1fQ.ag6cwibi1yaECmqA-KVbn-TzhSsnz82__LRtLvLoSFw",
      address: "123 Test St",
      phone: "123-456-7890",
      createdAt: new Date(),
      role: 'user',
      verificationToken: 'token123',
      verified: true,
    });

    jest.spyOn(jwtControllers, "decryptPassword").mockReturnValue("password123");

    await userControllers.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario logueado' });
  });
});
