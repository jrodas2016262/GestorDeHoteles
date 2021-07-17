'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RequestServiceSchema = Schema({
    servicioId: String,
    usuarioId: String,
    cancelado: Boolean
})

module.exports = mongoose.model('requestService', RequestServiceSchema)
