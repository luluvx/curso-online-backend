const authController = require('../../src/modules/auth/auth.controller');
const authService = require('../../src/modules/auth/auth.service');
const rolService = require('../../src/modules/rol/rol.service');

jest.mock('../../src/modules/auth/auth.service');
jest.mock('../../src/modules/rol/rol.service');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, cookies: {}, clearCookie: jest.fn() };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe devolver 200 y setear cookie si login es exitoso', async () => {
      req.body = { email: 'test@test.com', password: '123456' };
      authService.login.mockResolvedValue({
        token: 'jwt-token',
        usuario: { id: 1, username: 'testuser' }
      });

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith('test@test.com', '123456');
      expect(res.cookie).toHaveBeenCalledWith('authToken', 'jwt-token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login exitoso' });
    });

    it('debe devolver 401 si login falla', async () => {
      req.body = { email: 'test@test.com', password: 'wrongpass' };
      authService.login.mockRejectedValue(new Error('Credenciales inválidas'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas' });
    });
  });

  describe('logout', () => {
    it('debe limpiar cookie y devolver mensaje éxito', async () => {
      await authController.logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('authToken', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout exitoso' });
    });

    it('debe devolver 500 si ocurre error', async () => {
      // Simulamos error en clearCookie
      res.clearCookie.mockImplementation(() => { throw new Error('fail'); });

      await authController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error durante el logout' });
    });
  });

  describe('register', () => {
    it('debe registrar usuario y devolver 201 si rol existe', async () => {
      req.body = {
        username: 'user1',
        nombre: 'Nombre',
        apellido: 'Apellido',
        email: 'user1@test.com',
        password: '123456',
        rolId: 2
      };

      rolService.findById.mockResolvedValue({ id: 2, nombre: 'Rol Test' });
      authService.register.mockResolvedValue({ message: 'Usuario registrado exitosamente' });

      await authController.register(req, res);

      expect(rolService.findById).toHaveBeenCalledWith(2);
      expect(authService.register).toHaveBeenCalledWith(
        'user1', 'Nombre', 'Apellido', 'user1@test.com', '123456', 2
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario registrado exitosamente' });
    });

    it('debe devolver 400 si rol no existe', async () => {
      req.body.rolId = 999;
      rolService.findById.mockResolvedValue(null);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Rol no encontrado' });
    });

    it('debe devolver 400 si ocurre error en registro', async () => {
      req.body = {
        username: 'user1',
        nombre: 'Nombre',
        apellido: 'Apellido',
        email: 'user1@test.com',
        password: '123456',
        rolId: 2
      };

      rolService.findById.mockResolvedValue({ id: 2, nombre: 'Rol Test' });
      authService.register.mockRejectedValue(new Error('Error de registro'));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error de registro' });
    });
  });
});
