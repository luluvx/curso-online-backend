const { body, param } = require('express-validator');

exports.createCurso = [
    body('titulo').isLength({ min: 3 }).withMessage('El título es muy corto'),
    body('descripcion').isLength({ min: 5 }).withMessage('La descripción es muy corta'),
    body('categoriaId').isInt().withMessage('La categoría debe ser un número'),
    body('profesorId').optional().isInt().withMessage('El profesor debe ser un número'),
];

exports.updateCurso = [
    param('id').isInt().withMessage('ID inválido'),
    body('titulo').optional().isLength({ min: 3 }).withMessage('El título es muy corto'),
    body('descripcion').optional().isLength({ min: 5 }).withMessage('La descripción es muy corta'),
    body('categoriaId').optional().isInt().withMessage('La categoría debe ser un número'),
]; 