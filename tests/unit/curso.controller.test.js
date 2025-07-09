const cursoController = require('../../src/modules/curso/curso.controller');
const cursoService = require('../../src/modules/curso/curso.service');

jest.mock('../../src/modules/curso/curso.service');

describe('Curso Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {}, user: { id: 1 }, file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un curso y responder con 201 y json', async () => {
      req.body = { titulo: 'Curso 1', descripcion: 'Desc', categoriaId: 2, profesorId: 3 };
      cursoService.createCurso.mockResolvedValue({ id: 10, titulo: 'Curso 1' });

      await cursoController.create(req, res, next);

      expect(cursoService.createCurso).toHaveBeenCalledWith('Curso 1', 'Desc', 2, 1, 3);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 10, titulo: 'Curso 1' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe responder con status del error y mensaje si error tiene status', async () => {
      const err = { status: 400, message: 'Error personalizado' };
      cursoService.createCurso.mockRejectedValue(err);

      await cursoController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error personalizado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next si error no tiene status', async () => {
      const err = new Error('Error inesperado');
      cursoService.createCurso.mockRejectedValue(err);

      await cursoController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('findAll', () => {
    it('debe obtener todos los cursos sin filtros', async () => {
      cursoService.getCursos.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await cursoController.findAll(req, res, next);

      expect(cursoService.getCursos).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe validar y pasar filtros numéricos', async () => {
      req.query = { profesorId: '5', categoriaId: '3' };
      cursoService.getCursos.mockResolvedValue([{ id: 10 }]);

      await cursoController.findAll(req, res, next);

      expect(cursoService.getCursos).toHaveBeenCalledWith({ profesorId: 5, categoriaId: 3 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 10 }]);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe responder error 400 si profesorId no es numérico', async () => {
      req.query = { profesorId: 'abc' };

      await cursoController.findAll(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'profesorId debe ser un número válido' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe responder error 400 si categoriaId no es numérico', async () => {
      req.query = { categoriaId: 'xyz' };

      await cursoController.findAll(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'categoriaId debe ser un número válido' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next si getCursos falla sin status', async () => {
      const err = new Error('Error inesperado');
      cursoService.getCursos.mockRejectedValue(err);

      await cursoController.findAll(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('findById', () => {
    it('debe devolver curso con status 200', async () => {
      req.params.id = 12;
      cursoService.getCursoById.mockResolvedValue({ id: 12, titulo: 'Curso' });

      await cursoController.findById(req, res, next);

      expect(cursoService.getCursoById).toHaveBeenCalledWith(12);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 12, titulo: 'Curso' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe responder error con status si existe', async () => {
      const err = { status: 404, message: 'No encontrado' };
      cursoService.getCursoById.mockRejectedValue(err);
      req.params.id = 1;

      await cursoController.findById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No encontrado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next si error no tiene status', async () => {
      const err = new Error('Error inesperado');
      cursoService.getCursoById.mockRejectedValue(err);
      req.params.id = 1;

      await cursoController.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('update', () => {
    it('debe actualizar curso y responder 200', async () => {
      req.params.id = 2;
      req.body = { titulo: 'Nuevo título' };
      cursoService.updateCurso.mockResolvedValue({ id: 2, titulo: 'Nuevo título' });

      await cursoController.update(req, res, next);

      expect(cursoService.updateCurso).toHaveBeenCalledWith(2, { titulo: 'Nuevo título' }, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 2, titulo: 'Nuevo título' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe responder error con status si existe', async () => {
      const err = { status: 400, message: 'Error update' };
      cursoService.updateCurso.mockRejectedValue(err);
      req.params.id = 1;
      req.body = {};

      await cursoController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error update' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next si error no tiene status', async () => {
      const err = new Error('Error inesperado');
      cursoService.updateCurso.mockRejectedValue(err);
      req.params.id = 1;
      req.body = {};

      await cursoController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('remove', () => {
    it('debe eliminar curso y responder 200', async () => {
      cursoService.deleteCurso.mockResolvedValue({ message: 'Curso eliminado exitosamente' });
      req.params.id = 5;

      await cursoController.remove(req, res, next);

      expect(cursoService.deleteCurso).toHaveBeenCalledWith(5, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Curso eliminado exitosamente' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe responder error con status si existe', async () => {
      const err = { status: 404, message: 'No encontrado' };
      cursoService.deleteCurso.mockRejectedValue(err);
      req.params.id = 1;

      await cursoController.remove(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No encontrado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next si error no tiene status', async () => {
      const err = new Error('Error inesperado');
      cursoService.deleteCurso.mockRejectedValue(err);
      req.params.id = 1;

      await cursoController.remove(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('uploadPicture', () => {
    it('debe actualizar imagen y responder 200', async () => {
      req.params.id = 7;
      req.file = { filename: 'foto.jpg' };
      cursoService.updateCursoPicture.mockResolvedValue({ id: 7, imagenUrl: '/uploads/cursos/foto.jpg' });

      await cursoController.uploadPicture(req, res, next);

      expect(cursoService.updateCursoPicture).toHaveBeenCalledWith(7, '/uploads/cursos/foto.jpg', 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 7, imagenUrl: '/uploads/cursos/foto.jpg' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe devolver error 400 si no hay archivo', async () => {
      req.params.id = 7;
      req.file = null;

      await cursoController.uploadPicture(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Archivo de imagen es requerido' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar next si updateCursoPicture falla sin status', async () => {
      req.params.id = 7;
      req.file = { filename: 'foto.jpg' };
      const err = new Error('Error inesperado');
      cursoService.updateCursoPicture.mockRejectedValue(err);

      await cursoController.uploadPicture(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
