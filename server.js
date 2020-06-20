const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// import route
const route = require("./routes/routes");

const app = express();

//config
dotenv.config();

// connect DB
// "mongodb://127.0.0.1:27017"
// process.env.DB_CONNECT
const db_uri = process.env.DB_CONNECT;
mongoose.connect(
  db_uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log("DB Error");
    } else {
      console.log("Database ON");
    }
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

app.listen(port, () => console.log("Server ON"));
