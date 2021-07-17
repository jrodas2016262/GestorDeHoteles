'use strict'

const express = require("express");
const app  = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const user_ruta = require("./src/routes/user.routes");
const hotel_ruta = require("./src/routes/hotel.routes");
const room_ruta = require("./src/routes/room.routes");
const reserva_ruta = require("./src/routes/reserva.routes");
const service_ruta = require("./src/routes/service.routes");
const requestService = require("./src/routes/requestService.route");
const evento_ruta = require("./src/routes/evento.route");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());

app.use('/api', user_ruta);
app.use('/api', hotel_ruta);
app.use('/api', room_ruta);
app.use('/api', reserva_ruta);
app.use('/api', service_ruta);
app.use('/api', requestService);
app.use('/api', evento_ruta);

module.exports = app;
