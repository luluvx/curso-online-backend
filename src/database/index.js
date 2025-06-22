const dbConfig = require('@config/config.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.development.database,
    dbConfig.development.username,
    dbConfig.development.password,
    {
        host: dbConfig.development.host,
        port: dbConfig.development.port,
        dialect: dbConfig.development.dialect
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuarios = require('@modules/usuario/usuario.model.js')(sequelize, Sequelize);
db.roles = require('@modules/rol/rol.model.js')(sequelize, Sequelize);
db.categorias = require('@modules/categoria/categoria.model.js')(sequelize, Sequelize);
db.cursos = require('@modules/curso/curso.model.js')(sequelize, Sequelize);
db.inscripciones = require('@modules/inscripcion/inscripcion.model.js')(sequelize, Sequelize);
db.videos = require('@modules/video/video.model.js')(sequelize, Sequelize);
db.notas = require('@modules/nota/nota.model.js')(sequelize, Sequelize);
db.permisos = require('@modules/permiso/permiso.model.js')(sequelize, Sequelize);
db.rolPermisos = require('@modules/rol-permisos/rol-permisos.model.js')(sequelize, Sequelize);
db.comentarios = require('@modules/comentario/comentario.model.js')(sequelize, Sequelize);

// Un rol puede tener muchos usuarios
db.roles.hasMany(db.usuarios, {
    foreignKey: 'rolId'
});

// Un usuario pertenece a un rol
db.usuarios.belongsTo(db.roles, {
    foreignKey: 'rolId',
    as: 'rol'
});

db.roles.belongsToMany(db.permisos, {
    through: db.rolPermisos,
    foreignKey: 'rolId',
    otherKey: 'permisoId',
    as: 'permisos'
});
db.permisos.belongsToMany(db.roles, {
    through: db.rolPermisos,
    foreignKey: 'permisoId',
    otherKey: 'rolId',
    as: 'roles'
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
