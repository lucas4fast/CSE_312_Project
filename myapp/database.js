const sequelize = require("sequelize");
const sql = new sequelize(
  "postgres://postgres:postgres@postgres:5432/postgres"
);


module.exports = {
  sql: sql,
};