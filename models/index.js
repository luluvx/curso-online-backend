const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.DIALECT,
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


// Un rol puede tener muchos usuarios
db.roles.hasMany(db.usuarios, {
    foreignKey: 'rolId',
});

// Un usuario pertenece a un rol
db.usuarios.belongsTo(db.roles, {
    foreignKey: 'rolId',
    as: 'rol',
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});






module.exports = db;