const express = require("express");
var path = require("path");
const app = express();
const port = 8001;
app.use(express.static(path.join(__dirname, "msgClient")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/msg.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
