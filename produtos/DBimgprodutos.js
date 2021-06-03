const Sequelize = require("sequelize");
const connection = require("../database/database");
const Produto = require("./DBprodutos");
const User = require("../user/DBUsers");

const ImgProduto = connection.define('TB_IMG_PRODUTOS', {
    ID_IMG: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    NOME_IMG: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    KEY_IMG: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    SIZE_IMG: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    CREATED_AT: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }, 
}, {
    timestamps: false
});

ImgProduto.belongsTo(Produto, { foreignKey: 'FK_PRODUTO'});
ImgProduto.belongsTo(User, { foreignKey: 'FK_USUARIO' });

//ImgProduto.sync({force:true});

module.exports = ImgProduto;