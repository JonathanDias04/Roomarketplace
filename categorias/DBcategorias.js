const Sequelize = require("sequelize")
const connection = require("../database/database")

const Categoria = connection.define('TB_CATEGORIAS_PRODUTOS', {
    ID_CATEGORIA: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NOME_CATEGORIA: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    DESCRICAO_CATEGORIA: {
        type: Sequelize.STRING,
        allowNull: false
    },
    NOME_IMAGEM: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    SLUG_CATEGORIA: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Categoria;