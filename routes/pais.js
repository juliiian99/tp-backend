var express = require('express');
var router = express.Router();
const Pais = require('../schemas/paisSchema');

router.get('/', async function (req, res) {
    let paises = JSON.parse(JSON.stringify(await Pais.find()));
    res.json(paises);
});

router.get('/:nombre', async function (req, res) {
    let pais = JSON.parse(JSON.stringify(await Pais.findByName(req.params.nombre)));
    res.json(pais);
});

router.post('/', async function (req, res) {
    const nuevoPais = new Pais(req.body.pais);
    await nuevoPais.save();
    res.status(201).json();
});

router.put('/:nombre', async function (req, res) {
    const filter = { nombre: req.params.nombre };
    const update = req.body.pais;
    await Pais.updateOne(filter, update);
    res.status(204).json();
});

router.delete('/:nombre', function (req, res) {
    Pais.deleteOne({ nombre: req.params.nombre }, function (err) {
        res.status(204).json();
    });
});

module.exports = router;