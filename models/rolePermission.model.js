module.exports = (sequelize, DataTypes) => {
    const RolePermission = sequelize.define('rolePermission', {
        rolId: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        permisoId: {
        type: DataTypes.INTEGER,
        allowNull: false
        }
    }, {
        tableName: 'role_permissions',
        timestamps: false
    });

    return RolePermission;
};
