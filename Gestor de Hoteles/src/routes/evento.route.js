'use strict'

const express = require("express");
const eventoControler = require("../controlers/evento.controler");
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getEventos', eventoControler.getEventos);
api.get('/getEventoID', eventoControler.getEventoID);

api.get('/getEventosByHotel/:idHotel', md_autentication.ensureAuth, eventoControler.getEventosByHotel);
api.post('/addEvento', md_autentication.ensureAuth, eventoControler.addEvento);

module.exports = api;
