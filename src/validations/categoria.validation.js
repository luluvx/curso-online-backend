const { body, param } = require('express-validator');

exports.createCategoria = [
    body('nombre').isLength({ min: 2 }).withMessage('El nombre es muy corto'),
];

exports.updateCategoria = [
    param('id').isInt().withMessage('ID inválido'),
    body('nombre').optional().isLength({ min: 2 }).withMessage('El nombre es muy corto'),
]; 