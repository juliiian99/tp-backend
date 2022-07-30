const mongoose = require('mongoose');;
const { Schema } = mongoose;

const JugadorSchema = new Schema(
{
    nombre_usuario: {type: String, unique: true},
    nombre: String,
    apellido: String,
    contrasena: String,
},
{
    collection: 'Jugadores'
});

JugadorSchema.static('findByName', function (name){
    return this.findOne({ nombre_usuario: name });
});

module.exports = JugadorSchema;