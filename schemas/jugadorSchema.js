const mongoose = require('mongoose');;
const { Schema } = mongoose;
var connection = require('../data/dbConnection');

const JugadorSchema = new Schema(
    {
        nombre_usuario: { type: String, unique: true },
        nombre: String,
        apellido: String,
        contrasena: String,
        pais: { type: mongoose.Schema.Types.ObjectId, ref: 'Pais' }
    },
    {
        collection: 'Jugadores'
    });

JugadorSchema.static('findByName', function (name) {
    return this.findOne({ nombre_usuario: name });
});

module.exports = connection.model('Jugador', JugadorSchema);