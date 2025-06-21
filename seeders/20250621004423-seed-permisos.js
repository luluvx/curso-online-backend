'use strict';

const { PERMISSIONS } = require('../config/permission.config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const permisos = Object.values(PERMISSIONS).map(codigo => ({
      codigo,
      nombre: codigo.replace(/_/g, ' ').toLowerCase(), // 'CREATE_COURSE' → 'create course'
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('permisos', permisos, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permisos', {
      codigo: Object.values(PERMISSIONS)
    }, {});
  }
};
