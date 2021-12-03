const sequelize = require("sequelize");
const sql = new sequelize(
  "postgres://postgres:postgres@postgres:5432/postgres"
);
const user = sql.define(
  "user",
  {
    username: {
      type: sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
    },
    id: {
      type: sequelize.BIGINT,
      autoIncrement: true,
    },
    online: {
      type: sequelize.BOOLEAN,
      defaultValue: false,

    }
  },
  {
    timestamps: false,
    tableName: "user",
  }
);

module.exports = {
  sql: sql,
  user:user,

};