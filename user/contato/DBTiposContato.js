const Sequelize = require("sequelize")
const connection = require("../../database/database");

const TipoContatos = connection.define('TB_TIPOS_CONTATOS', {
    ID_TIPO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    NOME_TIPO_CONTATO: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = TipoContatos;