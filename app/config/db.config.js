const Sequelize = require("sequelize");

sequelize = new Sequelize({
  host: "localhost",
  database: "faisalDb",
  username: "faisal",
  password: "123456",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
