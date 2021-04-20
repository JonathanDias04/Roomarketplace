const Sequelize = require("sequelize");
const connection = new Sequelize('Roomarketplace', 'root', 'Jonathan2001!', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;