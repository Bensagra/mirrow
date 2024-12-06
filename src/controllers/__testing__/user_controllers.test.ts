import { userControllers } from "../user_controllers";
import { prismaMock } from "../../singelton";
import { jest } from "@jest/globals";
import * as jwtControllers from "../../utilities/jwt";

jest.mock("../../utilities/emailVerification");
jest.mock("../../utilities/passwordReset");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("userControllers.login", () => {
  it("debería autenticar a un usuario correctamente", async () => {
    // Mock de request y response
    const req = { body: { email: "test@example.com", password: "password123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock de utilidades de JWT
    const encryptedPassword = jwtControllers.encryptPassword("password123");
    jest.spyOn(jwtControllers, "encryptPassword").mockReturnValue(encryptedPassword);
    jest.spyOn(jwtControllers, "decryptPassword").mockReturnValue("password123");

    // Mock de Prisma
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: "Test",
      surname: "User",
      email: "test@example.com",
      password: encryptedPassword,
      address: "123 Test St",
      phone: "123-456-7890",
      createdAt: new Date(),
      role: "user",
      verificationToken: "token123",
      verified: true,
    });

    // Llamada al controlador
    await userControllers.login(req, res);

    // Verifica que el controlador se comporta como se espera
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuario logueado" });
  });
});
