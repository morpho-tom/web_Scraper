const express = require("express");
const { addData } = require("../controller/userController");
const router = express.Router();

router.get("/addData", addData);

module.exports = router;
