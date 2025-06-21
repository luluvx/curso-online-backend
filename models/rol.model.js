
module.exports = (sequelize, Sequelize) => {
    const Rol = sequelize.define("rol", {
        codigo : {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
    },{
        tableName: "roles",
        timestamps: true
    });

    return Rol;
}