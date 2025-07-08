module.exports = (sequelize, DataTypes) => {
    const TipoNota = sequelize.define(
        'tipoNota',
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cursoId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'tipos_nota',
            timestamps: false
        }
    );

    TipoNota.associate = models => {
        TipoNota.belongsTo(models.cursos, {
            foreignKey: 'cursoId',
            as: 'curso'
        });
        TipoNota.hasMany(models.notas, {
            foreignKey: 'tipoNotaId',
            as: 'notas'
        });
    };

    return TipoNota;
}; 