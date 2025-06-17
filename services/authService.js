const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (email, password) => {

    const usuario = await db.usuarios.findOne({ where: { email } });
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return {
        token,
        usuario: {
            id: usuario.id,
            username: usuario.username,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email
        }
    };
}


const register = async (username, nombre, apellido, email, password) => {
    if (!username || !nombre || !apellido || !email || !password) {
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
        password: hashedPassword
    });

    await newUser.save();
    return { message: 'Usuario registrado exitosamente' };
};

module.exports = {
    login,
    register
};