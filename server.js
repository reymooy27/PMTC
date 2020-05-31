const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// import route
const route = require("./routes/routes");

const app = express();

//config
dotenv.config();

// connect DB
mongoose.connect(
  "mongodb://127.0.0.1:27017",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Database ON");
  }
);

// middleware
app.use(
  express.json({
    limit: "2mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);
app.use(express.static("public"));

app.set("view engine", "ejs");

// route
app.use(route);

//port
const port = process.env.PORT || 3000;
app.listen(port);
console.log("Server ON");
