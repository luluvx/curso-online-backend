const db = require('@db');
const Usuario = db.usuarios;
const { NotFoundError, BadRequestError } = require('@utils/errors');
const bcrypt = require('bcrypt');
const ROLES = require('@constants/roles');

const findAll = async (rolCodigo) => {
    const where = {};
    let include = [{
        model: db.roles,
        as: 'rol',
        attributes: ['id', 'codigo', 'nombre']
    }];
    if (rolCodigo) {
        include[0].where = { codigo: rolCodigo };
    }
    return await Usuario.findAll({
        attributes: { exclude: ['password', 'rolId'] },
        include
    });
};

const findById = async id => {
    const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['password', 'rolId'] },
        include: [{
            model: db.roles,
            as: 'rol',
            attributes: ['id', 'codigo', 'nombre']
        }]
    });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    return usuario;
};

const update = async (id, datos) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    const { nombre, apellido, email } = datos;
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (email) usuario.email = email;
    await usuario.save();
    return usuario;
};

const remove = async id => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    await usuario.destroy();
    return { message: 'Usuario eliminado exitosamente' };
};

const changePassword = async (id, currentPassword, newPassword, userRequesting) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    const isSelf = userRequesting.id === usuario.id;
    const isAdmin = userRequesting.rol && (userRequesting.rol.codigo === ROLES.ADMIN);
    if (!isSelf && !isAdmin) {
        throw new BadRequestError('No tienes permiso para cambiar esta contraseña');
    }

    // Hashear y guardar la nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);
    usuario.password = hashed;
    await usuario.save();
    return;
};

module.exports = { findAll, findById, update, remove, changePassword }; 