'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("UserTypes", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: '1'
      },
      createdAt: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
      }
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
