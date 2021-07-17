'use strict'

const express = require("express");
const roomControler = require("../controlers/room.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getAllRooms', md_autentication.ensureAuth, roomControler.getAllRooms);
api.post('/addRooms', md_autentication.ensureAuth, roomControler.addRooms);
api.get('/getRoomsByHotel/:IDhotel', roomControler.getRoomsByHotel);
api.delete('/deleteRoom/:idRoom', md_autentication.ensureAuth, roomControler.deleteRoom);
api.get('/getRoomsTrue', roomControler.getRoomsTrue);
api.get('/getRoomsFalse', roomControler.getRoomsFalse);

module.exports = api;
