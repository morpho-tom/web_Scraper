const db = require("../models");
const District = db.District;
const Block = db.Block;
const Village = db.Village;
const Survey = db.Survey;
const OwnerName = db.OwnerName;

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

user.getBlockData = async (req, res) => {
  const { districtCode } = req.query;

  console.log("find the district code ", districtCode);

  try {
    const blocks = await Block.findAll({
      where: { District_code: districtCode },
    });
    res.status(200).json({
      status: "success",
      blocks,
    });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve blocks.",
    });
  }
};

user.getVillageData = async (req, res) => {
  const { blockCode } = req.query;

  try {
    const villages = await Village.findAll({
      where: { Block_code: blockCode },
    });
    res.status(200).json({
      status: "success",
      villages,
    });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve blocks.",
    });
  }
};

user.getSurveyNo = async (req, res) => {
  const { villageCode } = req.query;

  try {
    const survey_no = await Survey.findAll({
      where: { Village_code: villageCode },
      attributes: ["id", "survey_no"],
    });
    res.status(200).json({
      status: "success",
      survey_no,
    });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve blocks.",
    });
  }
};

user.getOwnerName = async (req, res) => {
  const { surveyId } = req.query;

  try {
    const owners = await OwnerName.findAll({
      where: { survey_id: surveyId },
    });
    res.status(200).json({
      status: "success",
      owners,
    });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve blocks.",
    });
  }
};

module.exports = user;
