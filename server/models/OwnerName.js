module.exports = (sequelize, DataTypes) => {
  const OwnerName = sequelize.define("OwnerName", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    OwnerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    survey_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    District_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Block_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Village_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  OwnerName.associate = (models) => {
    OwnerName.belongsTo(models.Survey, {
      foreignKey: "survey_id",
      targetKey: "id",
    });
    OwnerName.belongsTo(models.District, {
      foreignKey: "District_code",
      targetKey: "value",
    });
    OwnerName.belongsTo(models.Block, {
      foreignKey: "Block_code",
      targetKey: "value",
    });
    OwnerName.belongsTo(models.Village, {
      foreignKey: "Village_code",
      targetKey: "value",
    });
  };

  return OwnerName;
};
