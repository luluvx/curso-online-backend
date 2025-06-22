module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        apellido: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Usuario;
};
