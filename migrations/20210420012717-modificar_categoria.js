'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

     return Promise.all([
      queryInterface.addColumn(
        'TB_CATEGORIAS_PRODUTOs', // table name
        'SLUG_CATEGORIAS', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
     ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

     down: (queryInterface, Sequelize) => {
      return Promise.all([
        queryInterface.removeColumn('TB_CATEGORIAS_PRODUTOs', 'SLUG_CATEGORIA')
      ]);
    }
  }
};
