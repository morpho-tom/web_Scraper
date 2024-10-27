"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OwnerNames", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      OwnerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      survey_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Surveys",
          key: "id",
        },
      },
      District_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Districts",
          key: "value",
        },
      },
      Block_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Blocks",
          key: "value",
        },
      },
      Village_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Villages",
          key: "value",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("OwnerNames");
  },
};
