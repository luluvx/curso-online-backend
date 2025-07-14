const { body, param } = require('express-validator');

exports.createUser = [
    body('email').isEmail().withMessage('Email inválido'),
    body('nombre').isLength({ min: 2 }).withMessage('El nombre es muy corto'),
    body('apellido').isLength({ min: 2 }).withMessage('El apellido es muy corto'),
    body('rolId').isInt().withMessage('El rol debe ser un número'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[a-z]/).withMessage('La contraseña debe tener al menos una letra minúscula')
        .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una letra mayúscula')
        .matches(/[0-9]/).withMessage('La contraseña debe tener al menos un número')
        .matches(/[^A-Za-z0-9]/).withMessage('La contraseña debe tener al menos un carácter especial'),
];

exports.updateUser = [
    param('id').isInt().withMessage('ID inválido'),
    body('nombre').optional().isLength({ min: 2 }).withMessage('El nombre es muy corto'),
    body('apellido').optional().isLength({ min: 2 }).withMessage('El apellido es muy corto'),
    body('email').optional().isEmail().withMessage('Email inválido'),
];

exports.changePassword = [
    body('newPassword')
        .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
        .matches(/[a-z]/).withMessage('La nueva contraseña debe tener al menos una letra minúscula')
        .matches(/[A-Z]/).withMessage('La nueva contraseña debe tener al menos una letra mayúscula')
        .matches(/[0-9]/).withMessage('La nueva contraseña debe tener al menos un número')
        .matches(/[^A-Za-z0-9]/).withMessage('La nueva contraseña debe tener al menos un carácter especial'),
]; 