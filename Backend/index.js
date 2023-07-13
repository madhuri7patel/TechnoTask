const express = require("express");
const cors = require("cors");
const { Router } = require("./routes/userfinacial.js");
const { connection } = require("./config/db.js");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", Router);

app.get("/", (req, res) => {
  res.send("Welcome");
});

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server listening on port " + PORT);
    });
  })
  .catch(() => {
    console.log("Error occurred while connecting to MongoDB");
  });
