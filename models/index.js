const dbConfig = require('../config/config.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.development.database,
    dbConfig.development.username,
    dbConfig.development.password, {
        host: dbConfig.development.host,
        port: dbConfig.development.port,
        dialect: dbConfig.development.dialect,
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.usuarios = require('./usuario.model.js')(sequelize, Sequelize);
db.roles = require('./rol.model.js')(sequelize, Sequelize);
db.categorias = require('./categoria.model.js')(sequelize, Sequelize);
db.cursos = require('./curso.model.js')(sequelize, Sequelize);
db.inscripciones = require('./inscripcion.model.js')(sequelize, Sequelize);
db.videos = require('./video.model.js')(sequelize, Sequelize);
db.notas = require('./nota.model.js')(sequelize, Sequelize);
db.permisos = require('./permiso.model.js')(sequelize, Sequelize);
db.rolePermissions = require('./rolePermission.model.js')(sequelize, Sequelize);


// Un rol puede tener muchos usuarios
db.roles.hasMany(db.usuarios, {
    foreignKey: 'rolId',
});

// Un usuario pertenece a un rol
db.usuarios.belongsTo(db.roles, {
    foreignKey: 'rolId',
    as: 'rol',
});

db.roles.belongsToMany(db.permisos, {
    through: db.rolePermissions,
    foreignKey: 'rolId',
    otherKey: 'permisoId',
    as: 'permisos'
});
db.permisos.belongsToMany(db.roles, {
    through: db.rolePermissions,
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