const express = require("express");
const router = express.Router();
const Country = require("../schemas/countrySchema");
const { body, validationResult } = require("express-validator");

const validate = [body("pais.nombre").not().isEmpty().isString()];

router.get("/", async function (req, res) {
  try {
    let countries = JSON.parse(JSON.stringify(await Pais.find()));
    res.json(countries);
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.get("/:nombre", async function (req, res) {
  try {
    let countries = JSON.parse(
      JSON.stringify(await Country.findByName(req.params.nombre))
    );
    res.json(countries);
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
    const newCountry = new Country(req.body.country);
    await newCountry.save();
    res.status(201).json();
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.put("/:name", validate, async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const filter = { name: req.params.name };
    const update = req.body.coutnry;
    await Country.updateOne(filter, update);
    res.status(204).json();
  } catch (e) {
    throw new Error(`${e}`);
  }
});

router.delete("/:name", function (req, res) {
  try {
    Pais.deleteOne({ name: req.params.name }, function (err) {
      res.status(204).json();
    });
  } catch (e) {
    throw new Error(`${e}`);
  }
});

module.exports = router;
