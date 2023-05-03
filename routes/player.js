var express = require("express");
var router = express.Router();
const Player = require("../schemas/playerSchema");
const { body, validationResult } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const bcrypt = require("bcryptjs");

const validate = [
  body("player.username").not().isEmpty().isString(),
  body("player.name").isString().optional(),
  body("player.lastname").isString().optional(),
  body(
    "player.password",
    "La contraseña debe contener al menos una mayuscula, una minuscula, un caracter especial, un numero y debe tener una longitud mayor a 6 caracteres"
  ).matches(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    "i"
  ),
];

router.get("/", verifyToken, async function (req, res) {
  try {
    let players = JSON.parse(
      JSON.stringify(await Player.find().populate("country"))
    );
    res.json(players);
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.get("/:username", verifyToken, async function (req, res) {
  try {
    let player = JSON.parse(
      JSON.stringify(
        await Player.findByName(req.params.username).populate("country")
      )
    );
    res.status(200).json(player);
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.post("/", verifyToken, validate, async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(req.body.player.password, salt);
    req.body.player.password = hashedPassword;

    const newPlayer = new Player(req.body.player);
    await newPlayer.save();
    res.status(201).json();
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.put("/:username", verifyToken, validate, async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const filter = { username: req.params.username };

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(req.body.player.password, salt);
    req.body.player.password = hashedPassword;
    const update = req.body.player;

    await Player.updateOne(filter, update);
    res.status(204).json();
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.delete("/:username", verifyToken, function (req, res) {
  try {
    Player.deleteOne({ username: req.params.username }, function (err) {
      res.status(204).json();
    });
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.get("/:username/country", verifyToken, async function (req, res) {
  try {
    let player = JSON.parse(
      JSON.stringify(
        await Player.findByName(req.params.username).populate("country")
      )
    );
    res.status(200).json(player.country);
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.post("/:username/country", verifyToken, async function (req, res) {
  try {
    let country = await Country.findByName(req.body.name);
    let player = await Player.findByName(req.params.username);
    player.country = country;
    country.players.push(player);
    await country.save();
    await player.save();
    res.status(201).json();
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.delete("/:username/country", verifyToken, async function (req, res) {
  try {
    let player = await Player.findByName(req.params.username);
    player.country = null;
    await player.save();
    res.status(204).json();
  } catch (e) {
    throw new Error(`${e}`);
  }
});

module.exports = router;
