'use strict'

const Evento = require("../models/evento.model");
const Hotel = require("../models/hotel.model");
const dateTime = require('node-datetime');
const Asistencia = require("../models/asistencia.model");

function getEventos(req, res) {
    Evento.find((err, eventosFind) =>{
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar eventos' })

        if (eventosFind) {
            return res.status(200).send({ eventosFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
    })
}

function getEventoID(req, res) {
    var idEvento = req.params.idEvento;

    Evento.findById({ idEvento }, (err, eventoFind) =>{
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar evento' })

        if (eventoFind) {
            return res.status(200).send({ eventoFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
    })
}

function getEventosByHotel(req, res) {
    var idHotel = req.params.idHotel;

    Hotel.findOne({ _id: idHotel }, (err, hotelFind) => {
        if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar el hotel' })
        if (!hotelFind) return res.status(500).send({ mensaje: 'Algo salio mal en la solicitud del hotel' })
        
        var asd = hotelFind._id;

        Evento.find({ hotelId: asd }, (err, eventosFinded) =>{
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar los eventos' })
            
            if (eventosFinded) {
                res.status(200).send( eventosFinded )
            } else {
                return res.status(500).send({ mensaje: 'Algo salio mal al solicitar eventos' })
            }
        })
    })
}

function addEvento(req, res) {
    var eventoModel = new Evento();
    var params = req.body;
    var dt = dateTime.create();
    var formatted = dt.format('m/d/Y');

    if (req.user.rol != 'admin_hotel') {
        return res.status(500).send({ mensaje: 'ERROR solamente los administradores del hotel pueden agregar eventos' })
    } else {
        
        Hotel.findOne({ nombre: req.user.usuario }, (err, hotelFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar el hotel' })
            if (!hotelFind) return res.status(500).send({ mensaje: 'Algo salio mal en la solicitud del hotel' })

            var idHotel = hotelFind._id;

            if (params.presupuesto &&  params.tipo ) {
                eventoModel.descripcion = params.descripcion;
                eventoModel.fecha = formatted;
                eventoModel.tipo = params.tipo;
                eventoModel.presupuesto = params.presupuesto;
                eventoModel.hotelId = idHotel;

                eventoModel.save((err, eventoSave) => {
                    if (err) return res.status(500).send({ mensaje: 'No se logro guardar el evento' })

                    if (eventoSave) {
                        res.status(200).send({ eventoSave })
                    } else {
                        res.status(500).send({ mensaje: 'No se pudo registrar el evento' })
                    }
                })

            } else {
                return res.status(500).send({ mensaje: 'No se han llenado todos los campos' })
            }
        })
    }
}

function asistirEvento(req, res) {
    var asistenciaModel = new Asistencia();
    var idEvento = req.params.idEvento;
    var params = req.body;

    if (req.user.rol === 'admin_general') {
        return res.status(500).send({ mensaje: 'ERROR el admin no puede asistir a eventos eventos' })
    } else {
        Evento.findOne({ _id: idEvento }, (err, eventoFind) =>{
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar el evento' })
            if (!eventoFind) return res.status(500).send({ mensaje: 'Algo salio mal en la solicitud del evento' })

            var sas = eventoFind._id;

            asistenciaModel.eventoId = sas;
            asistenciaModel.usuarioId = req.user.sub;

            asistenciaModel.save((err, asistSave) =>{
                if (err) return res.status(500).send({ mensaje: 'ERROR al guardar la asistencia al evento' })

                if (asistSave) {
                    res.status(200).send( asistSave )
                } else {
                    return res.status(500).send({ mensaje: 'Algo salio mal al guardar el evento' })
                }
            })

        })
    }

}

module.exports = {
    getEventos,
    getEventoID,
    addEvento,
    getEventosByHotel,
    asistirEvento
}