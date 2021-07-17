'use strict'

const express = require("express");
const requestServiceControler = require("../controlers/requestService.controler");
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getRequest', md_autentication.ensureAuth, requestServiceControler.getRequest);
api.get('/getRequestByUser', md_autentication.ensureAuth, requestServiceControler.getRequestByUser);
api.post('/requestService/:servicioId', md_autentication.ensureAuth, requestServiceControler.requestService);

module.exports = api;
