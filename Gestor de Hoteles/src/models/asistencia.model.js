'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AsistenciaSchema = Schema({
    eventoId: String,
    usuarioId: String
})

module.exports = mongoose.model('asistencia', AsistenciaSchema)
