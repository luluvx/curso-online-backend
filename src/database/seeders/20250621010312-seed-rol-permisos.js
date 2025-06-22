'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const roles = await queryInterface.sequelize.query(`SELECT id, codigo FROM roles;`);
        const permisos = await queryInterface.sequelize.query(`SELECT id, codigo FROM permisos;`);
        const rolesMap = Object.fromEntries(roles[0].map(role => [role.codigo, role.id]));
        const permisosMap = Object.fromEntries(
            permisos[0].map(permiso => [permiso.codigo, permiso.id])
        );

        const data = [];

        //permisos admin
        for (const permisoId of Object.values(permisosMap)) {
            data.push({
                rolId: rolesMap['ADMIN'],
                permisoId: permisoId
            });
        }

        // permisos profesor
        const permisosProfesor = [
            'CREATE_COURSE',
            'VIEW_COURSES',
            'VIEW_COURSE',
            'UPDATE_COURSE',
            'DELETE_COURSE',
            'ADD_VIDEO',
            'VIEW_VIDEOS',
            'VIEW_VIDEO',
            'UPDATE_VIDEO',
            'DELETE_VIDEO',
            'ASSIGN_GRADE',
            'VIEW_GRADES',
            'LIST_ENROLLMENTS'
        ];
        for (const codigo of permisosProfesor) {
            data.push({
                rolId: rolesMap['PROF'],
                permisoId: permisosMap[codigo]
            });
        }

        // permisos estudiante
        const permisosEstudiante = [
            'ENROLL_COURSE',
            'VIEW_MY_COURSES',
            'VIEW_VIDEOS',
            'VIEW_VIDEO',
            'VIEW_MY_GRADES',
            'ADD_COMMENT',
            'VIEW_COMMENTS',
            'UPDATE_COMMENT',
            'DELETE_COMMENT'
        ];
        for (const codigo of permisosEstudiante) {
            data.push({
                rolId: rolesMap['EST'],
                permisoId: permisosMap[codigo]
            });
        }
        await queryInterface.bulkInsert('rol_permisos', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('rol_permisos', null, {});
    }
};
