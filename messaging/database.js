const sequelize = require("sequelize");
const sql = new sequelize(
  "postgres://postgres:postgres@postgres:5432/postgres"
);
const chats = sql.define(
  "chats",
  {
    chatId: {
      type: sequelize.BIGINT,
      allowNull: false,
      unique: true,
    },
    userIds: {
      type: sequelize.ARRAY(sequelize.TEXT),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "chats",
  }
);

const messages = sql.define(
  "messages",
  {
    chatId: {
      type: sequelize.BIGINT,
      allowNull: false,
      unique: true,
    },
    messages: {
      type: sequelize.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "messages",
  }
);

module.exports = {
  sql: sql,
  chats: chats,
  messages: messages,
};
