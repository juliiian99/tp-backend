var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

var jugadoresRouter = require("./routes/jugador");
var paisRouter = require("./routes/pais");

var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());
app.options("*", cors());
const port = process.env.PORT || 8080;

const errorHandler = (error, req, res, next) => {
  res.status(500).send(`Something wrong ${error.message}`);
};

app.use("/jugadores", jugadoresRouter);
app.use("/paises", paisRouter);
app.use(errorHandler);

const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

const _ = require("lodash");

const Snake = require("./snake");
const Apple = require("./apple");

// ID's seed
let autoId = 0;
// Grid size
const GRID_SIZE = 40;
// Remote players 🐍
let players = [];
// Apples 🍎
let apples = [];

io.on("connection", function (client) {
  client.on("message", function (message) {
    io.emit("message", message);
  });

  client.on("disconnect", function () {
    console.log("A user disconnected");
  });

  let player;
  let id;

  client.on("auth", (opts, cb) => {
    // Create player
    id = ++autoId;
    player = new Snake(
      _.assign(
        {
          id,
          dir: "right",
          gridSize: GRID_SIZE,
          snakes: players,
          apples,
        },
        opts
      )
    );
    players.push(player);
    // Callback with id
    cb({ id: autoId });
  });

  // Receive keystrokes
  client.on("key", (key) => {
    // and change direction accordingly
    if (player) {
      player.changeDirection(key);
    }
  });

  // Remove players on disconnect
  client.on("disconnect", () => {
    _.remove(players, player);
  });
});

// Create apples
for (var i = 0; i < 3; i++) {
  apples.push(
    new Apple({
      gridSize: GRID_SIZE,
      snakes: players,
      apples,
    })
  );
}

// Main loop
setInterval(() => {
  players.forEach((p) => {
    p.move();
  });
  io.emit("state", {
    players: players.map((p) => ({
      x: p.x,
      y: p.y,
      id: p.id,
      nickname: p.nickname,
      points: p.points,
      tail: p.tail,
    })),
    apples: apples.map((a) => ({
      x: a.x,
      y: a.y,
    })),
  });
}, 100);

server.listen(port, () => console.log(`listening on port ${port}`));
