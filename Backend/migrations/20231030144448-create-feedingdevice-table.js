'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    queryInterface.createTable("FeedingDevices", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      title: {
        type: DataTypes.STRING,
      },
      feeder_id: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mac_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      other_info: {
        type: DataTypes.STRING,
        allowNull: true
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
