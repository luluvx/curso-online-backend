const jwt = require('jsonwebtoken');
const db = require('../models');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.authToken || (authHeader && authHeader.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

exports.isRole = (roleName) => {
    return async (req, res, next) => {
        const user = await db.usuarios.findByPk(req.user.id, { include: 'rol' });
        if (!user || user.rol.nombre !== roleName) {
        return res.status(403).json({ error: `Requiere rol de ${roleName}` });
        }
        next();
    };
};

exports.isAdmin     = exports.isRole('administrador');
exports.isProfessor = exports.isRole('profesor');
exports.isStudent   = exports.isRole('estudiante');
