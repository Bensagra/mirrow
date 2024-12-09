import { getMockReq, getMockRes } from '@jest-mock/express';
import { userControllers } from '../user_controllers';
import { prismaMock } from '../../singelton';
import * as jwtControllers from '../../utilities/jwt';

jest.mock('../../utilities/emailVerification');
jest.mock('../../utilities/passwordReset');
test("should mock Prisma client", () => {
  expect(prismaMock.user.findUnique).toBeDefined();
});
describe('userControllers.login', () => {
  it('debería autenticar a un usuario correctamente', async () => {
    // Crear request y response mockeados
    const req = getMockReq({
      body: { email: 'test@example.com', password: 'password123' },
    });

    const { res, clearMockRes } = getMockRes();
    clearMockRes(); // Limpia los mocks si se reutiliza res

    // Configurar el mock de Prisma
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: 'hashedPassword123',
      address: '123 Test St',
      phone: '123-456-7890',
      createdAt: new Date(),
      role: 'user',
      verificationToken: 'token123',
      verified: true,
    });

    // Mockear la desencriptación de contraseña
    jest.spyOn(jwtControllers, 'decryptPassword').mockReturnValue('password123');

    // Llamar al controlador
    await userControllers.login(req, res);

    // Aserciones
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario logueado' });
  });
});