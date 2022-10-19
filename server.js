const express = require("express");
const cors = require("cors");
const passport = require("passport");

const app = express();

require("./app/config/passport")(passport);
const sequelize = require("./app/config/db.config");

require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const tutorialRoutes = require("./app/routes/turorial.routes");
const userRoutes = require("./app/routes/user.routes");

sequelize
  .sync()
  .then(() => {
    console.log("Drop and re-sync db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/users", userRoutes);
app.use(
  "/tutorials",
  passport.authenticate("jwt", { session: false }),
  tutorialRoutes
);

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
