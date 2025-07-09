const inscripcionController = require('../../src/modules/inscripcion/inscripcion.controller');
const inscripcionService = require('../../src/modules/inscripcion/inscripcion.service');

jest.mock('../../src/modules/inscripcion/inscripcion.service');

describe('Inscripcion Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear una inscripción y responder 201 con json', async () => {
      req.params.cursoId = 10;
      inscripcionService.create.mockResolvedValue({ id: 1, cursoId: 10, estudianteId: 1 });

      await inscripcionController.create(req, res, next);

      expect(inscripcionService.create).toHaveBeenCalledWith(10, 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, cursoId: 10, estudianteId: 1 });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Falló creación');
      inscripcionService.create.mockRejectedValue(error);

      await inscripcionController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('findById', () => {
    it('debe devolver inscripción con status 200', async () => {
      req.params.id = 5;
      inscripcionService.findById.mockResolvedValue({ id: 5, cursoId: 10 });

      await inscripcionController.findById(req, res, next);

      expect(inscripcionService.findById).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 5, cursoId: 10 });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error findById');
      inscripcionService.findById.mockRejectedValue(error);

      await inscripcionController.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('remove', () => {
    it('debe eliminar inscripción y responder con status 200', async () => {
      req.params.id = 7;
      req.user.id = 1;
      inscripcionService.remove.mockResolvedValue({ message: 'Inscripción eliminada exitosamente' });

      await inscripcionController.remove(req, res, next);

      expect(inscripcionService.remove).toHaveBeenCalledWith(7, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Inscripción eliminada exitosamente' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error remove');
      inscripcionService.remove.mockRejectedValue(error);

      await inscripcionController.remove(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('findByCurso', () => {
    it('debe devolver lista de inscripciones con status 200', async () => {
      req.params.cursoId = 20;
      inscripcionService.findByCurso.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await inscripcionController.findByCurso(req, res, next);

      expect(inscripcionService.findByCurso).toHaveBeenCalledWith(20);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error findByCurso');
      inscripcionService.findByCurso.mockRejectedValue(error);

      await inscripcionController.findByCurso(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('findByEstudiante', () => {
    it('debe devolver cursos del estudiante con status 200', async () => {
      req.user.id = 3;
      inscripcionService.findByEstudiante.mockResolvedValue([{ cursoId: 101 }, { cursoId: 102 }]);

      await inscripcionController.findByEstudiante(req, res, next);

      expect(inscripcionService.findByEstudiante).toHaveBeenCalledWith(3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ cursoId: 101 }, { cursoId: 102 }]);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next con error si falla', async () => {
      const error = new Error('Error findByEstudiante');
      inscripcionService.findByEstudiante.mockRejectedValue(error);

      await inscripcionController.findByEstudiante(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
