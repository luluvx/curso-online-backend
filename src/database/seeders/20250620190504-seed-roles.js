'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'roles',
            [
                {
                    codigo: 'ADMIN',
                    nombre: 'administrador',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    codigo: 'PROF',
                    nombre: 'profesor',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    codigo: 'EST',
                    nombre: 'estudiante',
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
                codigo: ['ADMIN', 'PROF', 'EST']
            },
            {}
        );
    }
};
