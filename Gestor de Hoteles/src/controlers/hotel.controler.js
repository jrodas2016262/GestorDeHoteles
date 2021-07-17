'use strict'

const Hotel = require("../models/hotel.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt-nodejs");

function getHotels(req, res) {
    Hotel.find((err, hotelsFind) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar hoteles' })
        if (hotelsFind) {
            return res.status(200).send({ hotelsFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
    })
}

function getOneHotel(req, res) {
    var idHotel = req.params.idHotel;

    Hotel.findOne({ _id: idHotel }, (err, hotelFind) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar hotel' })
        if (hotelFind) {
            return res.status(200).send({ hotelFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
    })
}

function addHotel(req, res) {
    var hotelModel = new Hotel();
    var userModel = new User();
    var params = req.body;

    if (req.user.rol != 'admin_general') {
        return res.status(500).send({ mensaje: 'ERROR este usuario no puede agregar hoteles' })
    } else {
        if (params.nombre && params.lugar && params.passworduser && params.imagen) {
            hotelModel.nombre = params.nombre;
            hotelModel.lugar = params.lugar;
            hotelModel.descripcion = params.descripcion;
            hotelModel.imagen = params.imagen;

            var step1 = params.nombre + '@hotel.com';
            var step2 = step1.replace(/ /g, "");
            var email = step2.toLowerCase();

            userModel.usuario = params.nombre;
            userModel.email = email;
            userModel.rol = 'admin_hotel';

            Hotel.find({ nombre: hotelModel.nombre }, (err, hotelFind) => {
                if (err) return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

                if (hotelFind && hotelFind.length >= 1) {
                    return res.status(500).send({ mensaje: 'Ya existe un hotel con este nombre' })
                } else {
                    bcrypt.hash(params.passworduser, null, null, (err, passCrypt) => {
                        userModel.password = passCrypt;

                        hotelModel.save((err, saveHotel) => {
                            if (err) return res.status(500).send({ mensaje: 'ERROR al guardar hotel' })

                            if (saveHotel) {
                                res.status(200).send({ saveHotel })
                                userModel.save((err, saveUser) => {
                                    if (err) return res.status(500).send({ mensaje: 'ERROR al guardar usuario' })
                                    if (!saveUser) res.status(500).send({ mensaje: 'No se pudo registrar el admin del hotel' })
                                })
                            } else {
                                return res.status(500).send({ mensaje: 'No se pudo registrar un nuevo hotel' })
                            }
                        })

                    })
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'No se aceptan ciertos campos vacios' })
        }
    }
}

function editHotel(req, res) {
    var idHotel = req.params.idHotel;
    var params = req.body;

    delete params.passworduser
    delete params.solicitudes
    delete params.nombre

    if (req.user.rol != 'admin_hotel') {
        return res.status(500).send({ mensaje: 'Solo los administradores pueden realizar esta acción' })
    } else {
        Hotel.findByIdAndUpdate({ _id: idHotel, nombre: req.user.usuario }, params, { new: true }, (err, hotelFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datos' })
            if (!hotelFind) return res.status(500).send({ mensaje: 'Error al actualizar hotel' })
            return res.status(200).send({ hotelFind })
        })
    }
}

function getAdminHotel(req, res) {
    if (req.user.rol != 'admin_general') {
        return res.status(500).send({ mensaje: 'No se puede acceder a esta ruta debido a su rol' })
    } else {
        User.find({ rol: 'admin_hotel' }, (err, usersFind) => {
            if (err) return res.status(500).send({ mensaje: 'Error al solicitar usuarios' })
            if (usersFind) {
                return res.status(200).send({ usersFind })
            } else {
                return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
            }
        })
    }
}

module.exports = {
    getHotels,
    addHotel,
    getOneHotel,
    editHotel,
    getAdminHotel
}
