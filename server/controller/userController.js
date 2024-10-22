const District = require("../models").District;
const Block = require("../models").Block;
const user = {};

// Sample route
user.addData = (req, res) => {
  res.json({
    status: "success",
    message: "add files",
  });
};

user.getDistrictData = async (req, res) => {
  try {
    const districts = await District.findAll();
    res.status(200).json({
      status: "success",
      districts,
    });
  } catch (error) {
    console.error("Error fetching district data: ", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve districts.",
    });
  }
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

user.saveBlock = async (block) => {
  try {
    for (const block of blocks) {
      await Block.findOrCreate({
        where: { value: blocks.value },
        defaults: { name: blocks.name },
      });
    }
    console.log("Districts saved successfully!");
  } catch (error) {
    console.error("Error saving districts: ", error);
  }
};

module.exports = user;
