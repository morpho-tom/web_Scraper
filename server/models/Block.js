module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define("Block", {
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    District_code: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Districts",
        key: "value",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Define associations
  Block.associate = (models) => {
    Block.belongsTo(models.District, {
      foreignKey: "District_code",
      targetKey: "value",
      as: "district",
    });
  };

  return Block;
};
