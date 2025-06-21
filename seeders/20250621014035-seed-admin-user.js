'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [roles] = await queryInterface.sequelize.query(`SELECT id FROM roles WHERE codigo = 'ADMIN' LIMIT 1;`);
    const rolId = roles[0]?.id;

    if (!rolId) throw new Error('No se encontró el rol ADMIN');


    const hashedPassword = await bcrypt.hash('123', 10);

    await queryInterface.bulkInsert('usuarios', [{
      username: 'lulu',
      nombre: 'Luciana',
      apellido: 'Valera',
      email: 'luciana.valera.asp@gmail.com',
      password: hashedPassword,
      rolId: rolId,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', {
      email: 'luciana.valera.asp@gmail.com'
    }, {});
  }
};
