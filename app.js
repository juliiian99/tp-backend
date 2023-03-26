const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const playerRoutes = require("./routes/player");
const countryRoutes = require("./routes/country");
const authRoutes = require("./routes/auth");

const app = express();
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

app.use("/auth", authRoutes);
app.use("/players", playerRoutes);
app.use("/countries", countryRoutes);
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
  let player;
  let id;

  client.on("auth", (playerConfigurations, cb) => {
    // recuperar jugador con auth y
    // hacer player.nickname = Jugador.name y color
    // Create player
    id = ++autoId;
    player = new Snake(
      _.assign({
        id,
        dir: "right",
        gridSize: GRID_SIZE,
        snakes: players,
        apples,
        // color: playerConfigurations.color,
        nickname: playerConfigurations.nickname,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
    );
    players.push(player);
    // Callback with id
    cb({ id: autoId });
  });

  client.on("message", function (message) {
    io.emit("message", player.nickname, message);
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
      color: p.color,
    })),
    apples: apples.map((a) => ({
      x: a.x,
      y: a.y,
    })),
  });
}, 100);

server.listen(port, () => console.log(`listening on port ${port}`));
