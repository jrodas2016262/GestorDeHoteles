'use strict'

const Service = require("../models/service.model");
const Hotel = require("../models/hotel.model");

function getServices(req, res) {
    Service.find((err, serviceFind) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar listado de servicios' })

        if (serviceFind) {
            return res.status(200).send({ serviceFind })
        } else {
            return res.status(200).send({ mensaje: 'No se encontraron registros de servicios' })
        }
    })
}

function getServicesByHotel(req, res) {
    var idHotel = req.params.idHotel;

    Service.find({ hotelId: idHotel }, (err, serviceFind) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar listado de servicios' })

        if (serviceFind) {
            return res.status(200).send({ serviceFind })
        } else {
            return res.status(200).send({ mensaje: 'No se encontraron registros de servicios que coincidan con el hotel' })
        }
    })
}

function addService(req, res) {
    var serviceModel = new Service();
    var params = req.body;

    if (req.user.rol != 'admin_hotel') {
        return res.status(500).send({ mensaje: 'Solamente el administrador de la página puede registrar servicios' })
    } else {
        Hotel.findOne({ nombre: req.user.usuario }, (err, hotelFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar el hotel de la ruta' })

            var idHotel = hotelFind._id;
            if (hotelFind && hotelFind.nombre === req.user.usuario) {
                if (params.nombre && params.descripcion && params.precio) {
                    serviceModel.nombre = params.nombre;
                    serviceModel.descripcion = params.descripcion;
                    serviceModel.precio = params.precio;
                    serviceModel.hotelId = idHotel;

                    Service.find({ nombre: serviceModel.nombre }, (err, serviceFind) => {
                        if (err) return res.status(500).send({ mensaje: 'ERROR al verificar un servicio duplicado' })

                        if (serviceFind && serviceFind.length >= 1) {
                            return res.status(500).send({ mensaje: 'Ya existe un servicio con este nombre' })
                        } else {
                            serviceModel.save((err, serviceSave) => {
                                if (err) return res.status(500).send({ mensaje: 'ERROR al guardar un nuevo servicio' })

                                if (serviceSave) {
                                    res.status(200).send({ serviceSave })
                                } else {
                                    res.status(500).send({ mensaje: 'No se pudo registrar un nuevo servicio' })
                                }
                            })
                        }
                    })

                } else {
                    return res.status(500).send({ mensaje: 'Datos de servicios restantes' })
                }
            } else {
                return res.status(500).send({ mensaje: 'No se encontro coincidencias con el hotel enviado por la ruta' })
            }
        })
    }
}

module.exports = {
    getServices,
    getServicesByHotel,
    addService
}