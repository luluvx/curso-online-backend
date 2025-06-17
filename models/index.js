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


module.exports = db;