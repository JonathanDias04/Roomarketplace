const Sequelize = require("sequelize")
const connection = require("../../database/database");

const EstadoProduto = connection.define('TB_ESTADO_PRODUTO', {

    ID_ESTADO_PRODUTO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ESTADO_PRODUTO: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = EstadoProduto;