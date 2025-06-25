'use strict';

/** @type {import('sequelize-cli').Migration} */
const ROLES = require('../../constants/roles');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'roles',
            [
                {
                    codigo: ROLES.ADMIN,
                    nombre: ROLES.ADMIN_NOMBRE,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    codigo: ROLES.PROFESOR,
                    nombre: ROLES.PROFESOR_NOMBRE,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    codigo: ROLES.ESTUDIANTE,
                    nombre: ROLES.ESTUDIANTE_NOMBRE,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'roles',
            {
                codigo: [ROLES.ADMIN, ROLES.PROFESOR, ROLES.ESTUDIANTE]
            },
            {}
        );
    }
};
