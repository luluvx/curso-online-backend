module.exports = (sequelize, DataTypes) => {
    const Nota = sequelize.define(
        'nota',
        {
            valor: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            inscripcionId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            tipoNotaId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'notas',
            timestamps: true
        }
    );

    Nota.associate = models => {
        Nota.belongsTo(models.inscripciones, {
            foreignKey: 'inscripcionId',
            as: 'inscripcion'
        });
        Nota.belongsTo(models.tipoNota, {
            foreignKey: 'tipoNotaId',
            as: 'tipoNota'
        });
    };

    return Nota;
};
