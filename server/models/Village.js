module.exports = (sequelize, DataTypes) => {
  const Village = sequelize.define("Village", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Village.associate = (models) => {
    Village.belongsTo(models.Block, {
      foreignKey: "Block_code",
      targetKey: "value",
      as: "Block",
    });
  };

  return Village;
};
