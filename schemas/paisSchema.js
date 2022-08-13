const mongoose = require('mongoose');;
const { Schema } = mongoose;
var connection = require('../data/dbConnection');

const PaisSchema = new Schema(
    {
        nombre: String,
        jugadores: [{ type: mongoose.Types.ObjectId, ref: 'Jugador' }]
    },
    {
        collection: 'paises'
    });

PaisSchema.static('findByName', function (name) {
    return this.findOne({ nombre: name });
});

module.exports = connection.model('Pais', PaisSchema);