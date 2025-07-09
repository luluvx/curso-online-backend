const notaController = require('../../src/modules/nota/nota.controller');
const notaService = require('../../src/modules/nota/nota.service');

jest.mock('../../src/modules/nota/nota.service');

describe('Nota Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear una nota y responder 201 con json', async () => {
      req.params.inscripcionId = 5;
      req.body = { valor: 8.5, tipoNotaId: 2 };
      notaService.create.mockResolvedValue({ id: 1, valor: 8.5, tipoNotaId: 2 });

      await notaController.create(req, res, next);

      expect(notaService.create).toHaveBeenCalledWith(5, 8.5, 2, 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, valor: 8.5, tipoNotaId: 2 });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error en create');
      notaService.create.mockRejectedValue(error);

      await notaController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('findByInscripcion', () => {
    it('debe devolver notas con status 200', async () => {
      req.params.inscripcionId = 10;
      notaService.findByInscripcion.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await notaController.findByInscripcion(req, res, next);

      expect(notaService.findByInscripcion).toHaveBeenCalledWith(10, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error findByInscripcion');
      notaService.findByInscripcion.mockRejectedValue(error);

      await notaController.findByInscripcion(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('findMine', () => {
    it('debe devolver notas propias con status 200', async () => {
      notaService.findMine.mockResolvedValue([{ id: 3 }, { id: 4 }]);

      await notaController.findMine(req, res, next);

      expect(notaService.findMine).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 3 }, { id: 4 }]);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error findMine');
      notaService.findMine.mockRejectedValue(error);

      await notaController.findMine(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('debe actualizar una nota y responder 200 con json', async () => {
      req.params.id = 7;
      req.body = { valor: 9 };
      notaService.update.mockResolvedValue({ id: 7, valor: 9 });

      await notaController.update(req, res, next);

      expect(notaService.update).toHaveBeenCalledWith(7, { valor: 9 }, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 7, valor: 9 });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error update');
      notaService.update.mockRejectedValue(error);

      await notaController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('remove', () => {
    it('debe eliminar una nota y responder 200 con mensaje', async () => {
      req.params.id = 9;
      notaService.remove.mockResolvedValue({ message: 'Nota eliminada exitosamente' });

      await notaController.remove(req, res, next);

      expect(notaService.remove).toHaveBeenCalledWith(9, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nota eliminada exitosamente' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error remove');
      notaService.remove.mockRejectedValue(error);

      await notaController.remove(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
