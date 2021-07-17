'use strict'

const Room = require("../models/room.model");
const Reserva = require("../models/reserva.model")
const dateTime = require('node-datetime');

function getReservaciones(req, res) {
    if (req.user.rol != 'admin_general') {
        return res.status(500).send({ mensaje: 'Solo el administrador puede realizar esta opción' })
    } else {
        Reserva.find((err, findReservas) => {
            if (err) return res.status(500).send({ mensaje: 'Algo salio mal al solicitar reservaciones' })
            if (findReservas) {
                return res.status(500).send({ findReservas })
            } else {
                return res.status(500).send({ mensaje: 'No se encontraron registros de reservas' })
            }
        })
    }
}

function getReservacionesByUser(req, res) {
    Reserva.find({ idPersona: req.user.sub }, (err, findReservas) => {
        if (err) return res.status(500).send({ mensaje: 'Algo salio mal al solicitar reservaciones' })
        if (findReservas) {
            return res.status(500).send({ findReservas })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron registros de reservas' })
        }
    })
}

function reservar(req, res) {
    var reservaModel = new Reserva();
    var dt = dateTime.create();
    var params = req.body;
    var idCuartoReserva = req.params.idCuartoReserva;
    var formatted = dt.format('m/d/Y');

    if (req.user.rol != 'usuario') {
        return res.status(500).send({ mensaje: 'Solamente los usuario comunes pueden realizar reservaciones' })
    } else {
        Room.findOne({ _id: idCuartoReserva }, (err, roomFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar la habitación' })
            if (!roomFind) return res.status(500).send({ mensaje: 'Algo acurrio al solicitar la habitación' })

            var hotelID = roomFind.hotelId;

            if (roomFind.estado != false) {
                return res.status(500).send({ mensaje: 'ERROR la habitación ya se encuentra reservada' })
            } else {
                if (params.fechaFinal) {
                    reservaModel.fechaInicial = formatted;
                    reservaModel.fechaFinal = params.fechaFinal;
                    reservaModel.idPersona = req.user.sub;
                    reservaModel.idRoom = idCuartoReserva;
                    reservaModel.idHotel = hotelID;
                    reservaModel.cancelada = false;

                    console.log(formatted);

                    reservaModel.save((err, saveReserva) => {
                        if (err) return res.status(500).send({ mensaje: 'ERRRO al regsitrar la reserva' })

                        if (saveReserva) {
                            Room.findByIdAndUpdate({ _id: idCuartoReserva }, { estado: true }, (err, roomModified) => {
                                if (err) return res.status(500).send({ mensaje: 'ERROR en modificar el estado del cuarto' })
                            })
                            res.status(200).send({ saveReserva })
                        } else {
                            return res.status(500).send({ mensaje: 'Algo salio mal al registrar la reservación' })
                        }
                    })

                } else {
                    return res.status(500).send({ mensaje: 'No se encontro una habitación con este ID' })
                }
            }
        })
    }
}

function cancelarReservacion(req, res) {
    var reservaId = req.params.reservaId;

    if (req.user.rol != 'usuario') {
        return res.status(500).send({ mensaje: 'Solamente los usuario comunes pueden realizar reservaciones' })
    } else {
        Reserva.findOne({ _id: reservaId }, (err, reservaFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al comparar la reserva' })

            if (reservaFind) {

                Room.findOne({ _id: reservaFind.idRoom }, (err, roomFind) => {
                    if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar la comprobación de la habitación' })

                    if (roomFind.estado != true) return res.status(500).send({ mensaje: 'Solo se pueden cancelar si la habitación esta disponible' })
                    if (roomFind) {

                        Reserva.findByIdAndUpdate({ _id: reservaId }, { cancelada: true }, (err, reservaModified) => {
                            if (err) return res.status(500).send({ mensaje: 'ERROR al comparar la reserva' })
        
                        })
                        Room.findByIdAndUpdate({ _id: reservaFind.idRoom }, { estado: false }, (err, roomModified) => {
                            if (err) return res.status(500).send({ mensaje: 'ERROR en modificar el estado del cuarto' })
                                
                        })
                    
                    return res.status(200).send({ mensaje: 'Todo salio como se esperaba' })

                    } else {
                        return res.status(500).send({ mensaje: 'No se encontro la habitación' })
                    }
                })

            }
        })
    }
}

function ejemplo(req, res) {
    var dt = dateTime.create();
    /* dt.format('d/m/Y');
    console.log(new Date(dt.now())); */
    var formatted = dt.format('m/d/Y H:M:S');
    console.log(formatted);
}

module.exports = {
    reservar,
    getReservaciones,
    getReservacionesByUser,
    ejemplo,
    cancelarReservacion
}