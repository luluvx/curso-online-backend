'use strict';

const PERMISSIONS = require('../../constants/permissions');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const mapDescripcion = codigo => {
            const [modulo, accion] = codigo.split(':');
            let accionDesc = accion.replace(/_/g, ' ');
            accionDesc = accionDesc.charAt(0).toUpperCase() + accionDesc.slice(1);
            const moduloDesc = modulo.charAt(0).toUpperCase() + modulo.slice(1);
            return `${accionDesc} ${moduloDesc}`;
        };

        const permisos = Object.values(PERMISSIONS).map(codigo => ({
            codigo,
            descripcion: mapDescripcion(codigo),
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        await queryInterface.bulkInsert('permisos', permisos, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'permisos',
            {
                codigo: Object.values(PERMISSIONS)
            },
            {}
        );
    }
};
