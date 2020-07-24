const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const route = require("./routes/routes");
const tournamentRoutes = require("./routes/tournament");
const userRoutes = require("./routes/user");
const participantRoutes = require("./routes/participant");

const app = express();

//config
dotenv.config();

app.use(compression());
app.use(helmet());
app.use(cors());

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
app.use(tournamentRoutes);
app.use(userRoutes);
app.use(participantRoutes);

//port
const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Server ON"));
