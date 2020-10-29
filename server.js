const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const route = require("./routes/routes");
const tournamentRoutes = require("./routes/tournament");
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");
const deleteUnconfirmedTeam = require("./utils/deleteUnconfirmedTeam");
const app = express();
const port = process.env.PORT || 8000;
const db_uri = process.env.DB_CONNECT;

dotenv.config();
app.use(compression());
app.use(cookieParser())
app.use(helmet());
app.use(cors({credentials: true, origin: process.env.FRONTEND_URL}));
app.use(deleteUnconfirmedTeam);

mongoose.connect(
  db_uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      throw err
    }
  }
);

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

app.use(route);
app.use(tournamentRoutes);
app.use(userRoutes);
app.use(teamRoutes);

app.listen(port, ()=> console.log('server on'));
