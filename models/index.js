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


// Un rol puede tener muchos usuarios
db.roles.hasMany(db.usuarios, {
    foreignKey: 'rolId',
});

// Un usuario pertenece a un rol
db.usuarios.belongsTo(db.roles, {
    foreignKey: 'rolId',
    as: 'rol',
});



module.exports = db;