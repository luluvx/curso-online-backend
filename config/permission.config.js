// config/permissions.js

module.exports = {
    PERMISSIONS: {
        // Categorías
        CREATE_CATEGORY:    'CREATE_CATEGORY',
        VIEW_CATEGORIES:    'VIEW_CATEGORIES',
        VIEW_CATEGORY:      'VIEW_CATEGORY',
        UPDATE_CATEGORY:    'UPDATE_CATEGORY',
        DELETE_CATEGORY:    'DELETE_CATEGORY',

        // Cursos
        CREATE_COURSE:      'CREATE_COURSE',
        VIEW_COURSES:       'VIEW_COURSES',
        VIEW_COURSE:        'VIEW_COURSE',
        UPDATE_COURSE:      'UPDATE_COURSE',
        DELETE_COURSE:      'DELETE_COURSE',

        // Inscripciones
        ENROLL_COURSE:      'ENROLL_COURSE',       // inscribirse
        LIST_ENROLLMENTS:   'LIST_ENROLLMENTS',    // listar inscritos por curso
        VIEW_MY_COURSES:    'VIEW_MY_COURSES',     // listar mis cursos

        // Vídeos
        ADD_VIDEO:          'ADD_VIDEO',
        VIEW_VIDEOS:        'VIEW_VIDEOS',         // lista de videos por curso
        VIEW_VIDEO:         'VIEW_VIDEO',          // detalle de un video
        UPDATE_VIDEO:       'UPDATE_VIDEO',
        DELETE_VIDEO:       'DELETE_VIDEO',

        // Notas
        ASSIGN_GRADE:       'ASSIGN_GRADE',
        VIEW_GRADES:        'VIEW_GRADES',         // ver notas por inscripción
        VIEW_MY_GRADES:     'VIEW_MY_GRADES',      // ver todas mis notas

        // Comentarios
        ADD_COMMENT:        'ADD_COMMENT',
        VIEW_COMMENTS:      'VIEW_COMMENTS',
        UPDATE_COMMENT:     'UPDATE_COMMENT',
        DELETE_COMMENT:     'DELETE_COMMENT',

        // Roles
        CREATE_ROLE:        'CREATE_ROLE',         // crear rol
        VIEW_ROLES:         'VIEW_ROLES',          // listar roles
        VIEW_ROLE:          'VIEW_ROLE',           // ver detalle de un rol
        UPDATE_ROLE:        'UPDATE_ROLE',         // editar rol
        DELETE_ROLE:        'DELETE_ROLE',         // eliminar rol

        // Permisos
        CREATE_PERMISSION:  'CREATE_PERMISSION',   // crear permiso
        VIEW_PERMISSIONS:   'VIEW_PERMISSIONS',    // listar permisos
        VIEW_PERMISSION:    'VIEW_PERMISSION',     // ver detalle de un permiso
        UPDATE_PERMISSION:  'UPDATE_PERMISSION',   // editar permiso
        DELETE_PERMISSION:  'DELETE_PERMISSION',   // eliminar permiso

        //role-permissions
        ASSIGN_PERMISSIONS: 'ASSIGN_PERMISSIONS', // asignar permisos a un rol
        VIEW_ROLE_PERMISSIONS: 'VIEW_ROLE_PERMISSIONS', // ver permisos de un rol
        
    }
};
