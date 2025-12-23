'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('media', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal('(UUID())'),
    },

    file_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    file_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    size: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
      ),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('media');
}
