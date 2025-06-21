module.exports = (sequelize, DataTypes) => {
    const Permiso = sequelize.define('permiso', {
        codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true   // por ejemplo "crear:curso", "editar:comentario"
        },
        nombre: {
        type: DataTypes.STRING,
        allowNull: true
        }
    }, {
        tableName: 'permisos',
        timestamps: true
    });


    return Permiso;
};
