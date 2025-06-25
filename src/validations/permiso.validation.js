const { body, param } = require('express-validator');

exports.createPermiso = [
    body('codigo').isString().withMessage('El código es requerido'),
    body('descripcion').isString().withMessage('La descripción es requerida'),
];

exports.updatePermiso = [
    param('id').isInt().withMessage('ID inválido'),
    body('codigo').optional().isString().withMessage('El código es requerido'),
    body('descripcion').optional().isString().withMessage('La descripción es requerida'),
]; 