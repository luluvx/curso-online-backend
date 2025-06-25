const db = require('@db/index');
const Progreso = db.progresos;
const Video = db.videos;
const Inscripcion = db.inscripciones;
const { ForbiddenError } = require('@utils/errors');

exports.marcarVisto = async (usuarioId, videoId) => {
    const video = await Video.findByPk(videoId);
    if (!video) throw new ForbiddenError('Video no encontrado');
    const inscripcion = await Inscripcion.findOne({ where: { estudianteId: usuarioId, cursoId: video.cursoId } });
    if (!inscripcion) throw new ForbiddenError('Debes estar inscrito en el curso para marcar como visto');
    const [progreso, created] = await Progreso.upsert({ usuarioId, videoId, visto: true });
    return progreso;
};

exports.obtenerProgresoCurso = async (usuarioId, cursoId) => {
    const videos = await Video.findAll({ where: { cursoId } });
    const vistos = await Progreso.count({ where: { usuarioId, visto: true, videoId: videos.map(v => v.id) } });
    const porcentaje = videos.length > 0 ? Math.round((vistos / videos.length) * 100) : 0;
    return { total: videos.length, vistos, porcentaje };
};
