'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('user', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('(UUID())'),
      primaryKey: true,
      allowNull: false
    },

    phone_number: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    username: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false
    },

    profile_picture: {
      type: Sequelize.STRING,
      allowNull: true
    },

    status: {
      type: Sequelize.ENUM('AVAILABLE', 'BUZY', 'DO_NOT_DISTURB', 'BE_RIGHT_BACK'),
      allowNull: false,
      defaultValue: 'AVAILABLE'
    },

    last_seen: {
      type: Sequelize.DATE,
      allowNull: true
    },

    language: {
      type: Sequelize.ENUM('ENGLISH', 'AMHARIC', 'ARABIC'),
      allowNull: false,
      defaultValue: 'ENGLISH'
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });
}

export async function down(queryInterface, Sequelize) {
  // must drop ENUM types manually for postgres, optional for mysql
  await queryInterface.dropTable('user');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_status";');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_language";');
}
