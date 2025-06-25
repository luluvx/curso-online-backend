const { body, param } = require('express-validator');

exports.createUser = [
    body('email').isEmail().withMessage('Email inválido'),
    body('nombre').isLength({ min: 2 }).withMessage('El nombre es muy corto'),
    body('apellido').isLength({ min: 2 }).withMessage('El apellido es muy corto'),
    body('rolId').isInt().withMessage('El rol debe ser un número'),
];

exports.updateUser = [
    param('id').isInt().withMessage('ID inválido'),
    body('nombre').optional().isLength({ min: 2 }).withMessage('El nombre es muy corto'),
    body('apellido').optional().isLength({ min: 2 }).withMessage('El apellido es muy corto'),
    body('email').optional().isEmail().withMessage('Email inválido'),
]; 