const { body, param } = require('express-validator');

exports.createVideo = [
    param('cursoId').isInt().withMessage('El curso debe ser un número'),
    body('titulo').isLength({ min: 2 }).withMessage('El título es muy corto'),
    body('url').isURL().withMessage('La URL no es válida'),
    body('orden').isInt().withMessage('El orden debe ser un número'),
];

exports.updateVideo = [
    param('id').isInt().withMessage('ID inválido'),
    body('titulo').optional().isLength({ min: 2 }).withMessage('El título es muy corto'),
    body('url').optional().isURL().withMessage('La URL no es válida'),
    body('orden').optional().isInt().withMessage('El orden debe ser un número'),
]; 