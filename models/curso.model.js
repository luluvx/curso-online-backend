module.exports = (sequelize, Sequelize) => {
    const Curso = sequelize.define(
        "curso",
        {
        titulo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        imagenUrl: {
            type: Sequelize.STRING,
            allowNull: true
        }
        },
        {
        tableName: "cursos"
        }
    );

    Curso.associate = (models) => {

        Curso.belongsTo(models.categorias, {
        foreignKey: "categoriaId",
        as: "categoria"
        });

        Curso.belongsTo(models.usuarios, {
        foreignKey: "profesorId",
        as: "profesor"
        });

        // Curso.hasMany(models.videos, {
        // foreignKey: "cursoId",
        // as: "videos",
        // onDelete: "CASCADE"
        // });
    };

    return Curso;
};