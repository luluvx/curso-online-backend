module.exports = (sequelize, DataTypes) => {
    const Nota = sequelize.define(
        'nota',
        {
            valor: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: true
            },
            inscripcionId: {
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
    };

    return Nota;
};
