const tipoNotaService = require('@modules/tipo-nota/tipo-nota.service');

exports.create = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const { cursoId } = req.params;
        const tipoNota = await tipoNotaService.create(cursoId, nombre);
        res.status(201).json(tipoNota);
    } catch (error) {
        next(error);
    }
};

exports.findByCurso = async (req, res, next) => {
    try {
        const { cursoId } = req.params;
        const tiposNota = await tipoNotaService.findByCurso(cursoId);
        res.status(200).json(tiposNota);
    } catch (error) {
        next(error);
    }
}; 