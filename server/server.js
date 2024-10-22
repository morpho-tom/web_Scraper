require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const router = require("./route/userRoute"); // Route handler
const app = express();
const db = require("./models");

// Use routes
app.use("/api/v1", router);

// Handle invalid routes
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "failed to connect this API",
  });
});

const PORT = process.env.PORT || 4000;

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database connected (:->)");

  app.listen(PORT, () => {
    console.log("App running on port:", PORT);
  });
});
