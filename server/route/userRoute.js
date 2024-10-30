const express = require("express");
const user = require("../controller/userController");
const router = express.Router();

router.get("/addData", user.addData);
router.get("/districts", user.getDistrictData);
router.get("/blocks", user.getBlockData);
router.get("/villages", user.getVillageData);
router.get("/surveyNo", user.getSurveyNo);
router.get("/ownerName", user.getOwnerName);

module.exports = router;
