var express = require("express");
var router = express.Router();
const Player = require("../schemas/playerSchema");
const Pais = require("../schemas/countrySchema");
const { body, validationResult } = require("express-validator");

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

router.get("/", async function (req, res) {
  try {
    let players = JSON.parse(
      JSON.stringify(await Player.find().populate("country"))
    );
    res.json(players);
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.get("/:username", async function (req, res) {
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

router.post("/", validate, async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newPlayer = new Player(req.body.player);
    await newPlayer.save();
    res.status(201).json();
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.put("/:username", validate, async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const filter = { username: req.params.username };
    const update = req.body.player;
    await Player.updateOne(filter, update);
    res.status(204).json();
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.delete("/:username", function (req, res) {
  try {
    Player.deleteOne({ username: req.params.username }, function (err) {
      res.status(204).json();
    });
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.get("/:username/country", async function (req, res) {
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

router.post("/:username/country", async function (req, res) {
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

router.delete("/:username/country", async function (req, res) {
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
