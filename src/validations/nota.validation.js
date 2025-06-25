const { body, param } = require('express-validator');

exports.createNota = [
    body('inscripcionId').isInt().withMessage('La inscripción debe ser un número'),
    body('valor').isNumeric().withMessage('El valor debe ser numérico'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser texto'),
];

exports.updateNota = [
    param('id').isInt().withMessage('ID inválido'),
    body('valor').optional().isNumeric().withMessage('El valor debe ser numérico'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser texto'),
];

exports.deleteNota = [
    param('id').isInt().withMessage('ID inválido'),
]; 