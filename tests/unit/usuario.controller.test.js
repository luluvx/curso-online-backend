const usuarioController = require('../../src/modules/usuario/usuario.controller');
const servicio = require('../../src/modules/usuario/usuario.service');

jest.mock('../../src/modules/usuario/usuario.service');

describe('Usuario Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe llamar a servicio.findAll con rol y devolver 200 con json', async () => {
      req.query.rol = 'admin';
      const usuariosMock = [{ id: 1, username: 'user1' }];
      servicio.findAll.mockResolvedValue(usuariosMock);

      await usuarioController.findAll(req, res, next);

      expect(servicio.findAll).toHaveBeenCalledWith('admin');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(usuariosMock);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next en caso de error', async () => {
      const error = new Error('Falló');
      servicio.findAll.mockRejectedValue(error);

      await usuarioController.findAll(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('findById', () => {
    it('debe llamar a servicio.findById con id y devolver 200 con json', async () => {
      req.params.id = 123;
      const usuarioMock = { id: 123, username: 'user123' };
      servicio.findById.mockResolvedValue(usuarioMock);

      await usuarioController.findById(req, res, next);

      expect(servicio.findById).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(usuarioMock);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next en caso de error', async () => {
      const error = new Error('Falló');
      servicio.findById.mockRejectedValue(error);
      req.params.id = 123;

      await usuarioController.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('debe llamar a servicio.update con id y body, devolver 200 con json', async () => {
      req.params.id = 45;
      req.body = { nombre: 'Nuevo Nombre' };
      const usuarioActualizado = { id: 45, nombre: 'Nuevo Nombre' };
      servicio.update.mockResolvedValue(usuarioActualizado);

      await usuarioController.update(req, res, next);

      expect(servicio.update).toHaveBeenCalledWith(45, { nombre: 'Nuevo Nombre' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(usuarioActualizado);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next en caso de error', async () => {
      const error = new Error('Falló');
      servicio.update.mockRejectedValue(error);
      req.params.id = 45;
      req.body = {};

      await usuarioController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('remove', () => {
    it('debe llamar a servicio.remove con id y devolver 200 con json', async () => {
      req.params.id = 99;
      const resultadoMock = { message: 'Usuario eliminado' };
      servicio.remove.mockResolvedValue(resultadoMock);

      await usuarioController.remove(req, res, next);

      expect(servicio.remove).toHaveBeenCalledWith(99);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(resultadoMock);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next en caso de error', async () => {
      const error = new Error('Falló');
      servicio.remove.mockRejectedValue(error);
      req.params.id = 99;

      await usuarioController.remove(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMe', () => {
    it('debe devolver usuario del req.user.id con 200', async () => {
      const usuarioMock = { id: 1, username: 'yo' };
      servicio.findById.mockResolvedValue(usuarioMock);

      await usuarioController.getMe(req, res, next);

      expect(servicio.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(usuarioMock);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next en caso de error', async () => {
      const error = new Error('Falló');
      servicio.findById.mockRejectedValue(error);

      await usuarioController.getMe(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
