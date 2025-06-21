const jwt = require('jsonwebtoken');
const db = require('../models');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.authToken || (authHeader && authHeader.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id:payload.id,
            rolCodigo: payload.rolCodigo,
            permisos:  payload.permisos
        };

        next();
    } catch (e) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};
