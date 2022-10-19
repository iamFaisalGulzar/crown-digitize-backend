const sequelize = require("../config/db.config");
const Sequelize = require("sequelize");

const User = sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
