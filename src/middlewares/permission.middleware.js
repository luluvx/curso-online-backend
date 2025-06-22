const { ForbiddenError } = require('@utils/errors');

exports.hasPermission = permiso => (req, res, next) => {
    if (!req.user || !Array.isArray(req.user.permisos)) {
        return next(new ForbiddenError('Permisos de usuario no encontrados'));
    }

    if (!req.user.permisos.includes(permiso)) {
        return next(new ForbiddenError(`Requiere permiso ${permiso}`));
    }

    next();
};
