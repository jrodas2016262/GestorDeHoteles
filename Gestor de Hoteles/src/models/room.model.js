'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RoomSchema = Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    estado: Boolean,
    hotelId: String
})

module.exports = mongoose.model('rooms', RoomSchema)
