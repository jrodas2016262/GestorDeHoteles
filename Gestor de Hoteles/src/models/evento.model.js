'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventoSchema = Schema({
    hotelId: String,
    descripcion: String,
    presupuesto: Number,
    tipo: String,
    fecha: Date
})

module.exports = mongoose.model('evento', EventoSchema)
