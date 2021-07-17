'use strict'

const express = require("express");
const hotelControler = require("../controlers/hotel.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.post('/addHotel', md_autentication.ensureAuth, hotelControler.addHotel);
api.put('/editHotel/:idHotel', md_autentication.ensureAuth, hotelControler.editHotel);
api.get('/getAdminHotel', md_autentication.ensureAuth, hotelControler.getAdminHotel);

api.get('/getHotels', hotelControler.getHotels);
api.get('/getOneHotel/:idHotel', hotelControler.getOneHotel);

module.exports = api;
