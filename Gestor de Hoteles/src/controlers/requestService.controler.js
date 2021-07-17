'use strict'

const Request = require("../models/requestService.model");
const Service = require("../models/service.model");
const Room = require("../models/room.model");

function getRequest(req, res) {
    if (req.user.rol === 'admin_general') {
        Request.find((err, requestFind) => {
            if (err) return res.status(500).send({ mensaje: 'Error al traer solicitudes' })
            if (requestFind) {
                return res.status(200).send({ requestFind })
            } else {
                return res.status(500).send({ mensaje: 'No se encontraron solicitudes para mostrar' })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No tiene permisos para solicitar esta ruta' })
    }
}

function getRequestByUser(req, res) {
    Request.find({ usuarioId: req.user.sub }, (err, requestFind) => {
        if (err) return res.status(500).send({ mensaje: 'Error al traer solicitudes' })
        if (requestFind) {
            return res.status(200).send({ requestFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron solicitudes para mostrar' })
        }
    })
}

function requestService(req, res) {
    var requestModel = new Request();
    var params = req.body;
    var servicioId = req.params.servicioId;

    if (req.user.rol != 'usuario') {
        return res.status(500).send({ mensaje: 'Unicamente usuarios pueden realizar esta acción' })
    } else {
        Service.findOne({ _id: servicioId }, (err, serviceFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar el servicio' })

            if (serviceFind) {
                requestModel.servicioId = servicioId;
                requestModel.usuarioId = req.user.sub;
                requestModel.cancelado = false;

                requestModel.save((err, requestSave) => {
                    if (err) return res.status(500).send({ mensaje: 'ERROR al registrar la solicitud del servicio' })

                        if (requestSave) {
                            res.status(200).send({ requestSave })
                        } else {
                            res.status(500).send({ mensaje: 'No se pudo registrar la solicitud' })
                        }
                })

            } else {
                return res.status(500).send({ mensaje: 'No se encontro el servicio mandado' })
            }
        })
    }
}

module.exports = {
    getRequest,
    getRequestByUser,
    requestService
}