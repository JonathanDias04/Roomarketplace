const Sequelize = require("sequelize")
const connection = require("../database/database");
const Cidade = require("./regiao/DBCidades");

const User = connection.define('TB_USUARIOS', {
    ID_USUARIO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    NICK_USUARIO: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    EMAIL_USUARIO: {
        type: Sequelize.STRING,
        allowNull: false
    },
    SENHA_USUARIO: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.belongsTo(Cidade, { foreignKey: 'FK_CIDADE' });

module.exports = User;