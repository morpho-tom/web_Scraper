"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Surveys", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      survey_no: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable("Surveys");
  },
};
