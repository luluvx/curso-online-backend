'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('tipos_nota', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nombre: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cursoId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'cursos',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            }
        });
        await queryInterface.addColumn('notas', 'tipoNotaId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'tipos_nota',
                key: 'id'
            },
            onDelete: 'CASCADE'
        });
        await queryInterface.removeColumn('notas', 'descripcion');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('notas', 'tipoNotaId');
        await queryInterface.addColumn('notas', 'descripcion', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.dropTable('tipos_nota');
    }
}; 