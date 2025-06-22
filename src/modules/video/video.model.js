module.exports = (sequelize, DataTypes) => {
    const Video = sequelize.define(
        'video',
        {
            titulo: {
                type: DataTypes.STRING,
                allowNull: false
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false
            },
            orden: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            cursoId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'videos',
            timestamps: true
        }
    );

    Video.associate = models => {
        Video.belongsTo(models.cursos, {
            foreignKey: 'cursoId',
            as: 'curso'
        });
    };

    return Video;
};
