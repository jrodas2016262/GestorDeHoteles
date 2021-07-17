'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reservaSchema = Schema({
    fechaInicial: Date,
    fechaFinal: Date,
    idPersona: String,
    idRoom: String,
    idHotel: String,
    cancelada: Boolean
})

module.exports = mongoose.model('reserva', reservaSchema)
