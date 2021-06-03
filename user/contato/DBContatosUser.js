const Sequelize = require("sequelize")
const connection = require("../../database/database");
const User = require("../DBUsers");
const TipoContatos = require("./DBTiposContato");

const Contatos = connection.define('TB_CONTATOS', {
    ID_CONTATO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ORDEM_CONTATO: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    CONTATO: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Contatos.belongsTo(User, { foreignKey: 'FK_USUARIO' });

Contatos.belongsTo(TipoContatos, { foreignKey: 'FK_TIPO_CONTATO' });

module.exports = Contatos;