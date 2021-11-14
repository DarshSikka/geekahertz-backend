const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const port = process.env.PORT || 5001;
const auth_routes = require("./auth/router");
const products_routes = require("./products/router");
const frontendPath = path.join(__dirname, "react/index.html");
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI, () => {
  console.log("DB Connected");
});
const parser = express.json();
app.use(parser);
app.use("/api/auth", auth_routes);
app.use("/api/products", products_routes);
app.get("/", (req, res) => {
  // return res.sendFile(frontendPath);
  return res.send("banane do bruh");
});
app.listen(port, () => console.log(`listening on port ${port}`));
