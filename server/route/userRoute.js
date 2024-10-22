const express = require("express");
const user = require("../controller/userController");
const router = express.Router();

router.get("/addData", user.addData);
router.get("/districts", user.getDistrictData);

module.exports = router;
