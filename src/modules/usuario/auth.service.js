const db = require('@db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (email, password) => {
    const usuario = await db.usuarios.findOne({
        where: { email },
        include: [
            {
                model: db.roles,
                as: 'rol',
                include: [
                    {
                        model: db.permisos,
                        as: 'permisos',
                        attributes: ['codigo'],
                        through: { attributes: [] }
                    }
                ]
            }
        ]
    });

    if (!usuario) {
        throw new NotFoundError('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
        throw new BadRequestError('Contraseña incorrecta');
    }
    const permisos = (usuario.rol.permisos || []).map(p => p.codigo);

    const payload = {
        id: usuario.id,
        username: usuario.username,
        rolId: usuario.rolId,
        rolCodigo: usuario.rol.codigo,
        permisos
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return {
        token,
        usuario: {
            id: usuario.id,
            username: usuario.username,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol.nombre,
            permisos
        }
    };
};

const register = async (username, nombre, apellido, email, password, rolId) => {
    if (!username || !nombre || !apellido || !email || !password || !rolId) {
        throw new Error('Todos los campos son requeridos');
    }

    const existingUser = await db.usuarios.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.usuarios.create({
        username,
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rolId
    });

    await newUser.save();
    return { message: 'Usuario registrado exitosamente' };
};

module.exports = {
    login,
    register
};
