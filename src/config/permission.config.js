module.exports = {
    PERMISSIONS: {
        // categorías
        CREATE_CATEGORY: 'CREATE_CATEGORY',
        VIEW_CATEGORIES: 'VIEW_CATEGORIES',
        VIEW_CATEGORY: 'VIEW_CATEGORY',
        UPDATE_CATEGORY: 'UPDATE_CATEGORY',
        DELETE_CATEGORY: 'DELETE_CATEGORY',

        // cursos
        CREATE_COURSE: 'CREATE_COURSE',
        VIEW_COURSES: 'VIEW_COURSES',
        VIEW_COURSE: 'VIEW_COURSE',
        UPDATE_COURSE: 'UPDATE_COURSE',
        DELETE_COURSE: 'DELETE_COURSE',

        // inscripciones
        ENROLL_COURSE: 'ENROLL_COURSE',
        LIST_ENROLLMENTS: 'LIST_ENROLLMENTS',
        VIEW_MY_COURSES: 'VIEW_MY_COURSES',

        // videos
        ADD_VIDEO: 'ADD_VIDEO',
        VIEW_VIDEOS: 'VIEW_VIDEOS',
        VIEW_VIDEO: 'VIEW_VIDEO',
        UPDATE_VIDEO: 'UPDATE_VIDEO',
        DELETE_VIDEO: 'DELETE_VIDEO',

        // notas
        ASSIGN_GRADE: 'ASSIGN_GRADE',
        VIEW_GRADES: 'VIEW_GRADES', // ver notas por inscripción
        VIEW_MY_GRADES: 'VIEW_MY_GRADES', // ver todas mis notas

        // comentarios
        ADD_COMMENT: 'ADD_COMMENT',
        VIEW_COMMENTS: 'VIEW_COMMENTS',
        UPDATE_COMMENT: 'UPDATE_COMMENT',
        DELETE_COMMENT: 'DELETE_COMMENT',

        // roles
        CREATE_ROLE: 'CREATE_ROLE',
        VIEW_ROLES: 'VIEW_ROLES',
        VIEW_ROLE: 'VIEW_ROLE',
        UPDATE_ROLE: 'UPDATE_ROLE',
        DELETE_ROLE: 'DELETE_ROLE',

        // permisos
        CREATE_PERMISSION: 'CREATE_PERMISSION',
        VIEW_PERMISSIONS: 'VIEW_PERMISSIONS',
        VIEW_PERMISSION: 'VIEW_PERMISSION',
        UPDATE_PERMISSION: 'UPDATE_PERMISSION',
        DELETE_PERMISSION: 'DELETE_PERMISSION',

        //role-permissions
        ASSIGN_PERMISSIONS: 'ASSIGN_PERMISSIONS', // asignar permisos a un rol
        VIEW_ROLE_PERMISSIONS: 'VIEW_ROLE_PERMISSIONS' // ver permisos de un rol
    }
};
