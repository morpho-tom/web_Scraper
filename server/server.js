require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
// const cors = require("cors");
const router = require("./route/userRoute");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 4000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for cross-origin requests
// app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Use routes
app.use("/api/v1", router);

// Define a route to render an EJS view
app.get("/", (req, res) => {
  res.render("html/index");
});

// Handle invalid routes
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Failed to connect this API",
  });
});

// Database synchronization and server start
(async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log("Database connected (:->)");

    app.listen(PORT, () => {
      console.log("App running on port:", PORT);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
})();
