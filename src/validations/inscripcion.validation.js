const { body, param } = require('express-validator');

exports.createInscripcion = [
    body('cursoId').isInt().withMessage('El curso debe ser un número'),
    body('estudianteId').isInt().withMessage('El estudiante debe ser un número'),
];

exports.deleteInscripcion = [
    param('id').isInt().withMessage('ID inválido'),
]; 