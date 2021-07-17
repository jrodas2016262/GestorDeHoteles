'use strict'

const Hotel = require("../models/hotel.model");
const User = require("../models/user.model");
const Room = require("../models/room.model");
const bcrypt = require("bcrypt-nodejs");

function getAllRooms(req, res) {
    if (req.user.rol != 'admin_general') {
        return res.status(500).send({ mensaje: 'Solo el administrador puede realizar esta acción' })
    } else {
        Room.find((err, roomsFind) => {
            if (err) return res.status(500).send({ mensaje: 'Error al solicitar habitaciones' })
            if (!roomsFind) return res.status(500).send({ mensaje: 'Error no se se encontraron coincidencias con habitaciones' });

            return res.status(200).send({ roomsFind })
        })
    }
}

function getRoomsByHotel(req, res) {
    var IDhotel = req.params.IDhotel;

    Room.find({hotelId: IDhotel}, (err, roomsFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar cuartos' })

        if (roomsFind) {
            return res.status(200).send({ roomsFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron coincidencias' })
        }
    })
}

function addRooms(req, res) {
    var roomModel = new Room();
    var params = req.body;
    console.log(params);

    if (req.user.rol != 'admin_hotel') {
        return res.status(500).send({ mensaje: 'Solo los administradores de hotel pueden agregar habitaciones' })
    } else {
        Hotel.findOne({ nombre: req.user.usuario }, (err, hotelFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar el hotel' })
            if (!hotelFind) return res.status(500).send({ mensaje: 'Algo salio mal en la solicitud del hotel' })

            var idHotel = hotelFind._id;

            if (params.nombre && params.precio) {
                roomModel.nombre = params.nombre;
                roomModel.precio = params.precio;
                roomModel.descripcion = params.descripcion;
                roomModel.hotelId = idHotel;
                roomModel.estado = false;

                roomModel.save((err, roomSave) =>{
                    if (err) return res.status(500).send({ mensaje: 'No se logro guardar la habitación' })

                    if (roomSave) {
                        res.status(200).send({ roomSave })
                    } else {
                        res.status(500).send({ mensaje: 'No se pudo registrar la habitación' })
                    }
                })

            } else {
                return res.status(500).send({ mensaje: 'No se han llenado todos los campos' })
            }
        })
    }
}

function deleteRoom(req, res) {
    var idRoom = req.params.idRoom;

    if (req.user.rol != 'admin_hotel') {
        return res.status(500).send({ mensaje: 'No tiene permisos para solicitar esta ruta' })
    } else {
        Hotel.findOne({ nombre: req.user.usuario }, (err, hotelFind) => {
            if (err) return res.status(500).send({ mensaje: 'Error al realizar la primera solicitud' })
            if (!hotelFind) return res.status(500).send({ mensaje: 'Error no se se encontraron coincidencias con el hotel y la habitación' })

            var hotelID = hotelFind._id;

            Room.findOne({_id:idRoom}, (err, roomFind) =>{
                if (err) return res.status(500).send({ mensaje: 'Error al solicitar habitación' })
                if (!roomFind) return res.status(500).send({ mensaje: 'Algo salio mal, parece que la habitación no pertenece a tu hotel' })

                if (hotelID != roomFind.idHotel) {
                    console.log(hotelID);
                    console.log(roomFind) 
                    return res.status(500).send({ mensaje: 'No se encontraron coincidencias para la ruta' })
                } else {
                    Room.findByIdAndDelete(idRoom, (err, roomsFind) => {
                        if (err) return res.status(500).send({ mensaje: 'Error al solicitar eliminar habitaciones' })
                        if (!roomsFind) return res.status(500).send({ mensaje: 'Error no se se encontraron coincidencias con habitaciones' });
        
                        return res.status(200).send({ mensaje: 'Habitación eliminada' })
                    })
                }
            })
        })
    }
    
}

function getRoomsTrue(req, res) {
    Room.find({estado: true}, (err, roomsFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de esta ruta' })

        if (roomsFind) {
            return res.status(200).send({ roomsFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron coincidencias con la comprobación' })
        }
    })
}

function getRoomsFalse(req, res) {
    Room.find({estado: false}, (err, roomsFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de esta ruta' })

        if (roomsFind) {
            return res.status(200).send({ roomsFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron coincidencias con la comprobación' })
        }
    })
}

module.exports = {
    getRoomsByHotel,
    addRooms,
    getAllRooms,
    deleteRoom,
    getRoomsTrue,
    getRoomsFalse
}