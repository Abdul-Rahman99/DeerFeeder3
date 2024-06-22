'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      last_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      usertype_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: '1'
      },
      feeder_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
      }
    }, {

      timestamps: true, createdAt: true,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Person');
  }
};
