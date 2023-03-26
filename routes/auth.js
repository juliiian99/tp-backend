const express = require("express");
const Player = require("../schemas/playerSchema");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "secretkey123456";

router.post("/register", function (req, res, next) {
  console.log("sadsadsadsa");
  const newPlayer = {
    nombre_usuario: req.body.name,
    password: bcrypt.hashSync(req.body.password),
  };

  Player.create(newPlayer, (err, player) => {
    if (err && err.code === 11000)
      return res.status(409).send("Email already exists");
    if (err) return res.status(500).send("Server error");
    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt.sign({ id: player.id }, SECRET_KEY, {
      expiresIn: expiresIn,
    });
    const playerData = {
      username: Player.name,
      password: Player.password,
      accessToken: accessToken,
      expiresIn: expiresIn,
    };
    // response
    res.send({ playerData });
  });
});

router.post("/login", function (req, res, next) {
  const PlayerData = {
    username: req.body.username,
    password: req.body.password,
  };
  Player.findOne({ username: PlayerData.username }, (err, Player) => {
    if (err) return res.status(500).send("Server error!");

    if (!Player) {
      res.status(409).send({ message: "Something is wrong" });
    } else {
      const resultPassword = bcrypt.compareSync(
        PlayerData.password,
        Player.password
      );
      if (resultPassword) {
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: Player.id }, SECRET_KEY, {
          expiresIn: expiresIn,
        });

        const dataPlayer = {
          name: Player.name,
          email: Player.email,
          accessToken: accessToken,
          expiresIn: expiresIn,
        };
        res.send({ dataPlayer });
      } else {
        res.status(409).send({ message: "Something is wrong" });
      }
    }
  });
});

module.exports = router;
