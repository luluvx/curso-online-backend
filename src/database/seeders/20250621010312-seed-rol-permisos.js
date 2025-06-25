'use strict';

const ROLES = require('../../constants/roles');
const PERMISSIONS = require('../../constants/permissions');

module.exports = {
    async up(queryInterface, Sequelize) {
        const roles = await queryInterface.sequelize.query(`SELECT id, codigo FROM roles;`);
        const permisos = await queryInterface.sequelize.query(`SELECT id, codigo FROM permisos;`);

        const rolesMap = Object.fromEntries(roles[0].map(r => [r.codigo, r.id]));
        const permisosMap = Object.fromEntries(permisos[0].map(p => [p.codigo, p.id]));

        const data = [];


        for (const permisoId of Object.values(permisosMap)) {
            data.push({ rolId: rolesMap[ROLES.ADMIN], permisoId });
        }


        const permisosProfesor = [
            PERMISSIONS.COURSE_CREATE,
            PERMISSIONS.COURSE_LIST,
            PERMISSIONS.COURSE_VIEW,
            PERMISSIONS.COURSE_UPDATE,
            PERMISSIONS.COURSE_DELETE,

            PERMISSIONS.VIDEO_ADD,
            PERMISSIONS.VIDEO_LIST,
            PERMISSIONS.VIDEO_VIEW,
            PERMISSIONS.VIDEO_UPDATE,
            PERMISSIONS.VIDEO_DELETE,

            PERMISSIONS.GRADE_ASSIGN,
            PERMISSIONS.GRADE_LIST,
            PERMISSIONS.ENROLLMENT_LIST
        ];
        for (const codigo of permisosProfesor) {
            data.push({ rolId: rolesMap[ROLES.PROFESOR], permisoId: permisosMap[codigo] });
        }


        const permisosEstudiante = [
            PERMISSIONS.COURSE_LIST,
            PERMISSIONS.CATEGORY_LIST,
            PERMISSIONS.CATEGORY_VIEW,
            PERMISSIONS.COURSE_VIEW,
            PERMISSIONS.ENROLL_IN_COURSE,
            PERMISSIONS.MY_COURSES_VIEW,
            PERMISSIONS.VIDEO_LIST,
            PERMISSIONS.VIDEO_VIEW,
            PERMISSIONS.MY_GRADES_VIEW,

            PERMISSIONS.COMMENT_ADD,
            PERMISSIONS.COMMENT_LIST,
            PERMISSIONS.COMMENT_UPDATE,
            PERMISSIONS.COMMENT_DELETE,

            PERMISSIONS.VIEW_PROGRESS
        ];
        for (const codigo of permisosEstudiante) {
            data.push({ rolId: rolesMap[ROLES.ESTUDIANTE], permisoId: permisosMap[codigo] });
        }

        await queryInterface.bulkInsert('rol_permisos', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('rol_permisos', null, {});
    }
};
