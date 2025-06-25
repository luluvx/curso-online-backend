module.exports = (sequelize, DataTypes) => {
    const Progreso = sequelize.define(
        'progreso',
        {
        visto: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        },
        {
        tableName: 'progresos',
        }
    );

    Progreso.associate = models => {
        Progreso.belongsTo(models.usuarios, { foreignKey: 'usuarioId', as: 'usuario' });
        Progreso.belongsTo(models.videos, { foreignKey: 'videoId', as: 'video' });
    };

    return Progreso;
};
