const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado, sesión no válida.' });
        }
        console.log('Usuario autenticado:', req.user);
        if (!allowedRoles.includes(req.user.rolId)) {
            return res.status(403).json({ error: 'Acceso denegado. Rol no autorizado.' });
        }

        next();
    };
};

module.exports = authorizeRole;
