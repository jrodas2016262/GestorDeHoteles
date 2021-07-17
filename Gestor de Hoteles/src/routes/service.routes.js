'use strict'

const express = require("express");
const serviceControler = require("../controlers/service.controler");
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getServices', serviceControler.getServices);
api.get('/getServicesByHotel/:idHotel', serviceControler.getServicesByHotel);

api.post('/addService', md_autentication.ensureAuth, serviceControler.addService);

module.exports = api;
