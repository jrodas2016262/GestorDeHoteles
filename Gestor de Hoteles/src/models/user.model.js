'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    email: String,
    usuario: String,
    password: String,
    rol: String
})

module.exports = mongoose.model('users', UserSchema)
