'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ServiceSchema = Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    hotelId: String
})

module.exports = mongoose.model('service', ServiceSchema)
