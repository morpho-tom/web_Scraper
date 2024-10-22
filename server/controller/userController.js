const District = require("../models").District;
const user = {};

// Sample route
user.addData = (req, res) => {
  res.json({
    status: "success",
    message: "add files",
  });
};

user.saveDistricts = async (districts) => {
  try {
    for (const district of districts) {
      await District.findOrCreate({
        where: { value: district.value },
        defaults: { name: district.name },
      });
    }
    console.log("Districts saved successfully!");
  } catch (error) {
    console.error("Error saving districts: ", error);
  }
};

module.exports = user;
