const Sequelize = require("sequelize");
const connection = require("../../database/database");
const Estado = require("./DBEstados");

const Cidade = connection.define('TB_CIDADES', {
    ID_CIDADE: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    NOME_CIDADE: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

Cidade.belongsTo(Estado, {foreignKey : 'FK_ESTADO'});

module.exports = Cidade;