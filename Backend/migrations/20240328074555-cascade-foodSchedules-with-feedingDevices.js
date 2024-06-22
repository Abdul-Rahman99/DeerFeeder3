'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('FoodSchedules', 'FoodSchedules_ibfk_1');
    await queryInterface.addConstraint('FoodSchedules', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'FoodSchedules_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.removeConstraint('UserDevices', 'UserDevices_ibfk_2');
    await queryInterface.addConstraint('UserDevices', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'UserDevices_ibfk_2',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });


    await queryInterface.removeConstraint('FeedingDones', 'FeedingDones_ibfk_1');
    await queryInterface.addConstraint('FeedingDones', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'FeedingDones_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.removeConstraint('SensorStatuses', 'SensorStatuses_ibfk_1');
    await queryInterface.addConstraint('SensorStatuses', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'SensorStatuses_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.removeConstraint('ClientMessages', 'ClientMessages_ibfk_1');
    await queryInterface.addConstraint('ClientMessages', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'ClientMessages_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.removeConstraint('FeedRunStatuses', 'FeedRunStatuses_ibfk_1');
    await queryInterface.addConstraint('FeedRunStatuses', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'FeedRunStatuses_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.removeConstraint('HeartBeats', 'HeartBeats_ibfk_1');
    await queryInterface.addConstraint('HeartBeats', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'HeartBeats_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.removeConstraint('Notifications', 'Notifications_ibfk_1');
    await queryInterface.addConstraint('Notifications', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'Notifications_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.removeConstraint('Responses', 'Responses_ibfk_1');
    await queryInterface.addConstraint('Responses', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'Responses_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.removeConstraint('SensorWorkings', 'SensorWorkings_ibfk_1');
    await queryInterface.addConstraint('SensorWorkings', {
      fields: ['feeder_id'],
      type: 'foreign key',
      name: 'SensorWorkings_ibfk_1',
      references: {
        table: 'FeedingDevices',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeConstraint('FeedingDevices', 'FoodSchedules_ibfk_1');
      await queryInterface.addConstraint('FoodSchedules', {
        fields: ['feeder_id'],
        type: 'foreign key',
        name: 'FoodSchedules_ibfk_1',
        references: {
          table: 'FeedingDevices',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      await queryInterface.removeConstraint('FeedingDevices', 'UserDevices_ibfk_2');
      await queryInterface.addConstraint('UserDevices', {
        fields: ['feeder_id'],
        type: 'foreign key',
        name: 'UserDevices_ibfk_2',
        references: {
          table: 'FeedingDevices',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      await queryInterface.removeConstraint('FeedingDevices', 'FeedingDones_ibfk_1');
      await queryInterface.addConstraint('FeedingDones', {
        fields: ['feeder_id'],
        type: 'foreign key',
        name: 'FeedingDones_ibfk_1',
        references: {
          table: 'FeedingDevices',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }