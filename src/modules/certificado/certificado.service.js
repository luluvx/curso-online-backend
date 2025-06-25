const db = require('@db');
const { crearPDFCertificado } = require('./certificado.utils');
const { NotFoundError, ForbiddenError } = require('@utils/errors');

const generarCertificado = async (usuarioId, cursoId) => {
    // Verifica inscripción
    const inscripcion = await db.inscripciones.findOne({ where: { cursoId, estudianteId: usuarioId } });
    if (!inscripcion) throw new ForbiddenError('No estás inscrito en este curso');

    // Verifica progreso
    const videos = await db.videos.findAll({ where: { cursoId } });
    const totalVideos = videos.length;
    if (totalVideos === 0) throw new ForbiddenError('El curso no tiene videos');
    const vistos = await db.progresos.findAll({
        where: {
            usuarioId,
            videoId: videos.map(v => v.id),
            visto: true
        }
    });
    const porcentaje = (vistos.length / totalVideos) * 100;
    if (porcentaje < 100) {
        throw new ForbiddenError('Debes ver todos los videos para obtener el certificado');
    }

    // Calcula el promedio de todas las notas
    const notas = await db.notas.findAll({ where: { inscripcionId: inscripcion.id } });
    if (!notas.length) throw new ForbiddenError('No tienes notas registradas en este curso');
    const promedio = notas.reduce((sum, n) => sum + n.valor, 0) / notas.length;
    if (promedio < 6) {
        throw new ForbiddenError('No tienes la nota mínima para obtener el certificado');
    }

    const usuario = await db.usuarios.findByPk(usuarioId);
    const curso = await db.cursos.findByPk(cursoId, { include: [{ model: db.usuarios, as: 'profesor' }] });
    if (!usuario || !curso) throw new NotFoundError('Datos no encontrados');

    // Generar PDF bonito usando el util
    return await crearPDFCertificado({ usuario, curso, promedio, cursoId, usuarioId });
};

module.exports = { generarCertificado }; 