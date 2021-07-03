const Sequelize = require("sequelize");
const connection = require("../database/database");
const Categoria = require("../categorias/DBcategorias");
const EstadoProduto = require("./EstadoProduto/DBEstadoProduto");
const User = require("../user/DBUsers");
const Cidade = require("../user/regiao/DBCidades");
const Estado = require("../user/regiao/DBEstados");

const Produto = connection.define('TB_PRODUTOS', {
    ID_PRODUTO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    TITULO_PRODUTO: {
        type: Sequelize.STRING,
        allowNull: false
    }, DESCRICAO_PRODUTO: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    VALOR_PRODUTO: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, 
    DATA_ATUALIZACAO: {
        type: Sequelize.DATE,
        allowNull: false
    },
    SLUG_PRODUTO: {
        type: Sequelize.STRING,
        allowNull: false
    },
    CONDICAO_ANUNCIO: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
});

Produto.belongsTo(Categoria, { foreignKey: 'FK_CATEGORIA'});
Produto.belongsTo(EstadoProduto, { foreignKey: 'FK_CONDICAO_PRODUTO'});
Produto.belongsTo(User, { foreignKey: 'FK_USUARIO' });
Produto.belongsTo(Cidade, { foreignKey: 'FK_CIDADE_PRODUTO'});
Produto.belongsTo(Estado, { foreignKey: 'FK_ESTADO_PRODUTO'});

module.exports = Produto;