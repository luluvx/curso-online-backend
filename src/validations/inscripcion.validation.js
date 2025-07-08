const { body, param } = require('express-validator');

exports.createInscripcion = [
    param('cursoId').isInt().withMessage('El curso debe ser un número'),
];

exports.deleteInscripcion = [
    param('id').isInt().withMessage('ID inválido'),
]; 