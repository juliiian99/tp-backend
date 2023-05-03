const express = require("express");
const Player = require("../schemas/playerSchema");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "secretkey123456";

router.post("/register", function (req, res, next) {
  const newPlayer = {
    nombre_usuario: req.body.name,
    password: bcrypt.hashSync(req.body.password),
  };

  Player.create(newPlayer, (err, player) => {
    if (err && err.code === 11000)
      return res.status(409).send("El nombre de usuario ya existe");
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
    res.send(playerData);
  });
});

router.post("/login", function (req, res, next) {
  const playerData = {
    username: req.body.username,
    password: req.body.password,
  };
  Player.findOne({ username: playerData.username }, (err, player) => {
    if (err) return res.status(500).send("Server error!");

    if (!player) {
      res.status(409).send({ message: "No se encontró el jugador" });
    } else {
      const resultPassword = bcrypt.compareSync(
        playerData.password,
        player.password
      );

      if (resultPassword) {
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: player.id }, SECRET_KEY, {
          expiresIn: expiresIn,
        });

        const playerData = {
          username: player.username,
          name: player.name,
          lastname: player.lastname,
          accessToken: accessToken,
          expiresIn: expiresIn,
        };
        res.send(playerData);
      } else {
        res.status(409).send({ message: "Something is wrong" });
      }
    }
  });
});

module.exports = router;
