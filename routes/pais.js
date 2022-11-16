var express = require('express');
var router = express.Router();
const Pais = require('../schemas/paisSchema');
const { body, validationResult } = require('express-validator');

const validate = [
    body('pais.nombre').not().isEmpty().isString(),
  ];

router.get('/', async function (req, res) {
    try{
        let paises = JSON.parse(JSON.stringify(await Pais.find()));
        res.json(paises);
}catch(e){
    throw new Error(`${e}`);
  }
});

router.get('/:nombre', async function (req, res) {
    try{
        let pais = JSON.parse(JSON.stringify(await Pais.findByName(req.params.nombre)));
        res.json(pais);
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
        const nuevoPais = new Pais(req.body.pais);
        await nuevoPais.save();
        res.status(201).json();
    }catch(e){
        throw new Error(`${e}`);
    }
});

router.put('/:nombre', validate, async function (req, res) {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const filter = { nombre: req.params.nombre };
        const update = req.body.pais;
        await Pais.updateOne(filter, update);
        res.status(204).json();
    }catch(e){
        throw new Error(`${e}`);
    }
});

router.delete('/:nombre', function (req, res) {
    try{
        Pais.deleteOne({ nombre: req.params.nombre }, function (err) {
            res.status(204).json();
        });
    }catch(e){
        throw new Error(`${e}`);
    }
});

module.exports = router;
