'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HotelSchema = Schema({
    nombre: String,
    lugar: String,
    descripcion: String,
    passworduser: String,
    imagen: String,
    solicitudes: Number
})

module.exports = mongoose.model('hotels', HotelSchema)
