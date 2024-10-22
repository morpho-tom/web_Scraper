"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Blocks", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      District_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Districts", // Referencing the 'Districts' table
          key: "value", // The key in the referenced table
        },
        onUpdate: "CASCADE", // Optional: What to do on update
        onDelete: "CASCADE", // Optional: What to do on delete
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Blocks"); // This will drop the Blocks table
  },
};
