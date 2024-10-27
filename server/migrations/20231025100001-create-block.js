"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Blocks", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
          model: "Districts",
          key: "value",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Blocks");
  },
};
