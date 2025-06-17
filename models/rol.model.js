
module.exports = (sequelize, Sequelize) => {
    const Rol = sequelize.define("rol", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
    },{
        tableName: "roles",
    });

    return Rol;
}