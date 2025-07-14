const { body, param } = require('express-validator');

exports.createComentario = [
    param('cursoId').isInt().withMessage('El curso debe ser un número'),
    body('contenido').isLength({ min: 2 }).withMessage('El comentario es muy corto'),
];

exports.updateComentario = [
    param('id').isInt().withMessage('ID inválido'),
    body('contenido').optional().isLength({ min: 2 }).withMessage('El comentario es muy corto'),
]; 