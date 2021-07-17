'use strict'

const express = require("express");
const userControler = require("../controlers/user.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getAllUsers', md_autentication.ensureAuth, userControler.getAllUsers);
api.put('/editUserAdmin/:idUser', md_autentication.ensureAuth, userControler.editUserAdmin);
api.delete('/deleteUserAdmin/:idUser', md_autentication.ensureAuth, userControler.deleteUserAdmin);

api.get('/getUserID/:idUser', userControler.getUserID);
api.post('/login', userControler.login);
api.post('/registrar', userControler.registrar);
api.put('/editUser', md_autentication.ensureAuth, userControler.editUser);

api.delete('/deleteUser', md_autentication.ensureAuth, userControler.deleteUser);

module.exports = api;
