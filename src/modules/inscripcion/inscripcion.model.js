module.exports = (sequelize, DataTypes) => {
    const Inscripcion = sequelize.define(
        'inscripcion',
        {
            estudianteId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            cursoId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            fechaInscripcion: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            }
        },
        {
            tableName: 'inscripciones',
            timestamps: true
        }
    );

    Inscripcion.associate = models => {
        Inscripcion.belongsTo(models.usuarios, {
            foreignKey: 'estudianteId',
            as: 'estudiante'
        });
        Inscripcion.belongsTo(models.cursos, {
            foreignKey: 'cursoId',
            as: 'curso'
        });
        Inscripcion.hasMany(models.notas, {
            foreignKey: 'inscripcionId',
            as: 'notas',
            onDelete: 'CASCADE'
        });
    };

    return Inscripcion;
};
