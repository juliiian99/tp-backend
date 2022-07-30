var express = require('express');
var router = express.Router();
var connection = require('../data/dbConnection');
const PlayerSchema = require('../schemas/jugadorSchema');

/* GET all users. */
router.get('/', async function(req, res) {
  const Jugador = connection.model('Jugador', PlayerSchema);
  let jugadores = JSON.parse(JSON.stringify(await Jugador.find()));
  res.json(jugadores);
});

/* GET user by id. */
router.get('/:nombre_usuario', async function(req, res) {
  const Jugador = connection.model('Jugador', PlayerSchema);
  let jugador = JSON.parse(JSON.stringify(await Jugador.findByName(req.params.nombre_usuario)));
  res.status(200).json(jugador);
});

/* POST new user. */
router.post('/', async function(req, res) {
  const Jugador = connection.model('Jugador', PlayerSchema);
  const nuevoJugador = new Jugador( req.body.jugador );
  await nuevoJugador.save();
  res.status(201).json();
});

/* UPDATE user by id. */
router.patch('/:nombre_usuario', async function(req, res) {
  const Jugador = connection.model('Jugador', PlayerSchema);
  const filter = { nombre_usuario: req.params.nombre_usuario };
  const update = req.body.jugador;
  await Jugador.updateOne(filter, update);
  res.status(204).json();
});

/* DELETE user by id */
router.delete('/:nombre_usuario', function(req, res) {
  const Jugador = connection.model('Jugador', PlayerSchema);
  Jugador.deleteOne({ nombre: req.params.nombre_usuario } , function(err) {
    if (err) {
      res.status(400).json();
    }else{
      res.status(204).json();
    }
  });
});

module.exports = router;
