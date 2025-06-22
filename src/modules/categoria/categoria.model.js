module.exports = (sequelize, Sequelize) => {
    const Categoria = sequelize.define(
        'categoria',
        {
            nombre: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            descripcion: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        },
        {
            tableName: 'categorias'
        }
    );
    return Categoria;
};
