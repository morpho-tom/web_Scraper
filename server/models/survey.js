module.exports = (sequelize, DataTypes) => {
  const Survey = sequelize.define("Survey", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    survey_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    District_code: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Districts",
        key: "value",
      },
    },
    Block_code: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Blocks",
        key: "value",
      },
    },
    Village_code: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Villages",
        key: "value",
      },
    },
  });

  Survey.associate = (models) => {
    Survey.belongsTo(models.District, {
      foreignKey: "District_code",
      targetKey: "value",
      as: "district",
    });

    Survey.belongsTo(models.Block, {
      foreignKey: "Block_code",
      targetKey: "value",
      as: "block",
    });

    Survey.belongsTo(models.Village, {
      foreignKey: "Village_code",
      targetKey: "value",
      as: "village",
    });
  };

  return Survey;
};
