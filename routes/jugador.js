var express = require('express');
var router = express.Router();
const Jugador = require('../schemas/jugadorSchema');
const Pais = require('../schemas/paisSchema');

/* GET all users. */
router.get('/', async function (req, res) {
  let jugadores = JSON.parse(JSON.stringify(await Jugador.find().populate('pais')));
  res.json(jugadores);
});

/* GET user by id. */
router.get('/:nombre_usuario', async function (req, res) {
  let jugador = JSON.parse(JSON.stringify(await Jugador.findByName(req.params.nombre_usuario).populate('pais')));
  res.status(200).json(jugador);
});

/* POST new user. */
router.post('/', async function (req, res) {
  const nuevoJugador = new Jugador(req.body.jugador);
  await nuevoJugador.save();
  res.status(201).json();
});

/* UPDATE user by id. */
router.patch('/:nombre_usuario', async function (req, res) {
  const filter = { nombre_usuario: req.params.nombre_usuario };
  const update = req.body.jugador;
  await Jugador.updateOne(filter, update);
  res.status(204).json();
});

/* DELETE user by id */
router.delete('/:nombre_usuario', function (req, res) {
  Jugador.deleteOne({ nombre: req.params.nombre_usuario }, function (err) {
    if (err) {
      res.status(400).json();
    } else {
      res.status(204).json();
    }
  });
});

router.get('/:nombre_usuario/pais', async function (req, res) {
  let jugador = JSON.parse(JSON.stringify(await Jugador.findByName(req.params.nombre_usuario).populate('pais')));
  res.status(200).json(jugador.pais);
});

router.post('/:nombre_jugador/pais', async function (req, res) {
  let pais = await Pais.findByName(req.body.nombre);
  let jugador = await Jugador.findByName(req.params.nombre_jugador);
  jugador.pais = pais;
  await jugador.save();
  res.status(201).json();
});

router.delete('/:nombre_jugador/pais', async function (req, res) {
  let jugador = await Jugador.findByName(req.params.nombre_jugador);
  jugador.pais = null;
  await jugador.save();
  res.status(204).json();
});

module.exports = router;
