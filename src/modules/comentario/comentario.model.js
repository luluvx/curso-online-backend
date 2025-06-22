module.exports = (sequelize, DataTypes) => {
    const Comentario = sequelize.define('comentario', {
        contenido: {
        type: DataTypes.TEXT,
        allowNull: false
        }
    }, {
        tableName: 'comentarios'
    });

    Comentario.associate = models => {
        Comentario.belongsTo(models.cursos, {
        foreignKey: 'cursoId',
        as: 'curso'
        });
        Comentario.belongsTo(models.usuarios, {
        foreignKey: 'usuarioId',
        as: 'autor'
        });
    };

    return Comentario;
};
