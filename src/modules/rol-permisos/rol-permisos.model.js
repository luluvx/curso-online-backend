module.exports = (sequelize, DataTypes) => {
    const RolPermiso = sequelize.define(
        'rolPermiso',
        {
            rolId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            permisoId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'rol_permisos',
            timestamps: false
        }
    );

    return RolPermiso;
};
