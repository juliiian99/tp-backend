var express = require('express');
var router = express.Router();
const Jugador = require('../schemas/jugadorSchema');
const Pais = require('../schemas/paisSchema');
const { body, validationResult } = require('express-validator');

const validate = [
  body('jugador.nombre_usuario').not().isEmpty().isString(),
  body('jugador.nombre').isString().optional(),
  body('jugador.apellido').isString().optional(),
  body("jugador.contrasena", "La contrasena debe contener al menos una mayuscula, una minuscula, un caracter especial, un numero y debe tener una longitud mayor a 6 caracteres").matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/, "i"),
];

router.get('/', async function (req, res) {
  try{
    let jugadores = JSON.parse(JSON.stringify(await Jugador.find().populate('pais')));
    res.json(jugadores);
  }
  catch(e){
    throw new Error(`${e}`);
  }
  });

router.get('/:nombre_usuario', async function (req, res) {
  try{
    let jugador = JSON.parse(JSON.stringify(await Jugador.findByName(req.params.nombre_usuario).populate('pais')));
    res.status(200).json(jugador);
  }catch(e){
    throw new Error(`${e}`);
  }
});

router.post('/', validate, async function (req, res) {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const nuevoJugador = new Jugador(req.body.jugador);
    await nuevoJugador.save();
    res.status(201).json();
  }catch(e){
    throw new Error(`${e}`);
  }
});

router.put('/:nombre_usuario', validate, async function (req, res) {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const filter = { nombre_usuario: req.params.nombre_usuario };
    const update = req.body.jugador;
    await Jugador.updateOne(filter, update);
    res.status(204).json();
  }catch(e){
    throw new Error(`${e}`);
  }
});

router.delete('/:nombre_usuario', function (req, res) {
  try{
    Jugador.deleteOne({ nombre_usuario: req.params.nombre_usuario }, function (err) {
      res.status(204).json();
    });
  }catch(e){
    throw new Error(`${e}`);
  }
});

router.get('/:nombre_usuario/pais', async function (req, res) {
  try{
    let jugador = JSON.parse(JSON.stringify(await Jugador.findByName(req.params.nombre_usuario).populate('pais')));
    res.status(200).json(jugador.pais);
  }catch(e){
    throw new Error(`${e}`);
  }
});

router.post('/:nombre_jugador/pais', async function (req, res) {
  try{
    let pais = await Pais.findByName(req.body.nombre);
    let jugador = await Jugador.findByName(req.params.nombre_jugador);
    jugador.pais = pais;
    pais.jugadores.push(jugador);
    await pais.save();
    await jugador.save();
    res.status(201).json();
  }catch(e){
    throw new Error(`${e}`);
  }
});

router.delete('/:nombre_jugador/pais', async function (req, res) {
  try{
    let jugador = await Jugador.findByName(req.params.nombre_jugador);
    jugador.pais = null;
    await jugador.save();
    res.status(204).json();
  }catch(e){
    throw new Error(`${e}`);
  }
});

module.exports = router;
