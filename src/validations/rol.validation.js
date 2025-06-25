const { body, param } = require('express-validator');

exports.createRol = [
    body('codigo').isString().withMessage('El código es requerido'),
    body('nombre').isString().withMessage('El nombre es requerido'),
];

exports.updateRol = [
    param('id').isInt().withMessage('ID inválido'),
    body('codigo').optional().isString().withMessage('El código es requerido'),
    body('nombre').optional().isString().withMessage('El nombre es requerido'),
]; 