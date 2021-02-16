const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const http = require('http');
const socketio = require('socket.io')
const cookieParser = require('cookie-parser')
const route = require("./routes/routes");
const tournamentRoutes = require("./routes/tournament");
const authRoutes = require('./routes/auth')
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");
const gameRoutes = require('./routes/game');
const chatRoutes = require('./routes/chat')
const notificationRoutes = require('./routes/notification')
const friendRequestRoutes = require('./routes/friendRequest')
// const deleteUnconfirmedTeam = require("./utils/deleteUnconfirmedTeam");
const app = express();
const port = process.env.PORT || 8000;
const db_uri = process.env.DB_CONNECT;

const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    // Production
    origin: process.env.FRONTEND_URL,
    // Development
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

dotenv.config();
app.use(compression());
app.use(cookieParser())
app.use(helmet());
// Production
app.use(cors({credentials: true, origin: process.env.FRONTEND_URL}));
// Development
// app.use(cors({credentials: true, origin: "http://localhost:3000"}));
// app.use(deleteUnconfirmedTeam);
app.use(function (req, res, next) {
  req.io = io;
  next();
});

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
app.use(authRoutes);
app.use(tournamentRoutes);
app.use(userRoutes);
app.use(teamRoutes);
app.use(gameRoutes);
app.use(chatRoutes);
app.use(notificationRoutes);
app.use(friendRequestRoutes);

server.listen(port, ()=> console.log('server on'));
