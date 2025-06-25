const service = require('./progreso.service');

exports.marcarVisto = async (req, res) => {
    const usuarioId = req.user.id;
    const { videoId } = req.params;
    const progreso = await service.marcarVisto(usuarioId, videoId);
    res.json(progreso);
};

exports.getProgresoCurso = async (req, res) => {
    const usuarioId = req.user.id;
    const { cursoId } = req.params;
    const progreso = await service.obtenerProgresoCurso(usuarioId, cursoId);
    res.json(progreso);
};
