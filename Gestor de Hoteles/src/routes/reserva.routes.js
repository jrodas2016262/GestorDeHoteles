'use strict'

const express = require("express");
const reservaControler = require("../controlers/reserva.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.post('/reservar/:idCuartoReserva', md_autentication.ensureAuth, reservaControler.reservar);
api.get('/getReservacionesByUser', md_autentication.ensureAuth, reservaControler.getReservacionesByUser);
api.get('/getReservaciones', reservaControler.getReservaciones);
api.get('/ejemplo', reservaControler.ejemplo);
api.put('/cancelarReservacion/:reservaId', md_autentication.ensureAuth, reservaControler.cancelarReservacion);

module.exports = api;
