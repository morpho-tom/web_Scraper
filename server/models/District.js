module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define("District", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  District.associate = (models) => {
    District.hasMany(models.Block, {
      foreignKey: "District_code",
      sourceKey: "value",
      as: "Blocks",
    });
  };

  return District;
};
