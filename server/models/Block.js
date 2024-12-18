module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define("Block", {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Block.associate = (models) => {
    Block.belongsTo(models.District, {
      foreignKey: "District_code",
      targetKey: "value",
      as: "District",
    });
    Block.hasMany(models.Village, {
      foreignKey: "Block_code",
      sourceKey: "value",
      as: "Villages",
    });
  };

  return Block;
};
