module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define("District", {
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

  return District;
};
