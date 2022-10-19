const sequelize = require("../config/db.config");
const Sequelize = require("sequelize");

const Tutorial = sequelize.define("tutorial", {
  title: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  published: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = Tutorial;
