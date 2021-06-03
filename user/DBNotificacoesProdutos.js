const Sequelize = require("sequelize")
const connection = require("../database/database");
const User = require("./DBUsers");
const Produto = require("../produtos/DBprodutos");

const Notificacao = connection.define('TB_NOTIFICACOES_PRODUTOS', {
    ID_NOTIFICACO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    DESCRICAO_NOTIFICACAO: {
        type: Sequelize.STRING,
        allowNull: false
    },
    VISUALIZADO: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

Notificacao.belongsTo(User, { foreignKey: 'FK_USER_PRODUTO' });
Notificacao.belongsTo(User, { foreignKey: 'FK_USER_INTERESSE' });
Notificacao.belongsTo(Produto, { foreignKey: 'FK_PRODUTO' });

module.exports = Notificacao;