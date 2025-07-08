const db = require('@db');
const TipoNota = db.tipoNota;

const create = async (cursoId, nombre) => {
    return await TipoNota.create({ nombre, cursoId });
};

const findByCurso = async (cursoId) => {
    return await TipoNota.findAll({ where: { cursoId } });
};

module.exports = {
    create,
    findByCurso
}; 