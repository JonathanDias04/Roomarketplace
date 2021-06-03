const Sequelize = require("sequelize");
const connection = require("../../database/database");

const Estado = connection.define('TB_ESTADOS', {
    ID_ESTADO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    NOME_ESTADO: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    UF_ESTADO: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Estado;