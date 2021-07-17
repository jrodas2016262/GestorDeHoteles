'use strict'

const User = require("../models/user.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt.user");

function mainStart(req, res) {
    let userModel = new User();

    userModel.usuario = 'Admin'
    userModel.password = '123456'
    userModel.rol = 'admin_general'

    User.find({ usuario: userModel.usuario }, (err, userFind) => {
        if (err) return console.log("ERROR en la peticion")

        if (userFind && userFind.length >= 1) {
            console.log("Usuario Admin creado!")
        } else {
            bcrypt.hash(userModel.password, null, null, (err, passCrypt) => {
                userModel.password = passCrypt;
            })

            userModel.save((err, saveUser) => {
                if (err) return console.log("ERROR al crear el usuario Admin")

                if (saveUser) {
                    console.log("Usuario Creado")
                }
            })
        }
    })
}

function getAllUsers(req, res) {
    if (req.user.rol === 'admin_general') {
        User.find({ rol: 'usuario' }, (err, usersFind) => {
            if (err) return res.status(500).send({ mensaje: 'Error al solicitar usuarios' })
            if (usersFind) {
                return res.status(200).send({ usersFind })
            } else {
                return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No tiene permisos para solicitar usuarios' })
    }
}

function getUserID(req, res) {
    var idUser = req.params.idUser;

    User.findOne({ _id: idUser }, (err, userFind) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar usuario' })
        if (userFind) {
            return res.status(200).send({ userFind })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
    })
}

function login(req, res) {
    var params = req.body;
    
    User.findOne({ usuario: params.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })

        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, correctPass) => {
                if (err) return res.status(500).send({ mensaje: 'Error al encontrar usuario' })

                if (correctPass) {
                    usuarioEncontrado.password = undefined;
                    return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado), usuarioEncontrado })
                } else {
                    return res.status(500).send({ mensaje: 'No se identifico al usuario' })
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'El usuario no ha logrado ingresar' })
        }
    })
}

function registrar(req, res) {
    var usuarioModel = new User();
    var params = req.body;
    console.log(params);
    if (params.usuario && params.email && params.password && params.nombre) {
        usuarioModel.nombre = params.nombre;
        usuarioModel.usuario = params.usuario;
        email = params.email;

        var email = email.replace(/ /g, ""); 
        var email = email.toLowerCase();
        
        usuarioModel.email = email;
        usuarioModel.rol = 'usuario';

        User.find({
            $or: [
                { usuario: usuarioModel.usuario },
                { email: usuarioModel.email }
            ]
        }).exec((err, userFind) => {
            if (err) return res.status(500).send({ mensaje: '' })

            if (userFind && userFind.length >= 1) {
                return res.status(500).send({ mensaje: 'El usuario o correo ya existe' })
            } else {
                bcrypt.hash(params.password, null, null, (err, passCrypt) => {
                    usuarioModel.password = passCrypt;

                    usuarioModel.save((err, userSave) => {
                        if (err) return res.status(500).send({ mensaje: 'ERROR al guardar un nuevo registro' })

                        if (userSave) {
                            res.status(200).send({ userSave })
                        } else {
                            res.status(500).send({ mensaje: 'No se pudo registrar un nuevo usuario' })
                        }
                    })
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'Datos de usuario restantes' })
    }
}

function editUser(req, res) {
    var idUser = req.user.sub;
    var params = req.body;

    delete params.password
    delete params.rol

    if (req.user.rol === 'admin_general' || req.user.rol === 'admin_hotel') {
        return res.status(500).send({ mensaje: 'No puede modificar este usuario' })
    } else {
        User.findByIdAndUpdate(idUser, params, { new: true }, (err, userFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datos' })
            if (!userFind) return res.status(500).send({ mensaje: 'Error al actualizar usuario' })
            return res.status(200).send({ userFind })
        })
    }
}

function editUserAdmin(req, res) {
    var idUser = req.params.idUser;
    var params = req.body;

    delete params.password
    delete params.rol

    if (req.user.rol === 'admin_general') {
        User.findByIdAndUpdate(idUser, params, { new: true }, (err, userFind) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datos' })
            if (!userFind) return res.status(500).send({ mensaje: 'Error al actualizar usuario' })
            return res.status(200).send({ userFind })
        })
    } else {
        return res.status(500).send({ mensaje: 'Este usuario no puede modificar' })
    }
}

function deleteUser(req, res) {
    var idUser = req.user.sub;

    if (req.user.rol === 'admin_general' || req.user.rol === 'admin_hotel') {
        return res.status(500).send({ mensaje: 'No puede modificar este usuario' })
    } else {
        User.findByIdAndDelete(idUser, (err, userDeleted) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar eliminar usuario' })
            if (!userDeleted) return res.status(500).send({ mensaje: 'ERROR al eliminar al usuario' })

            return res.status(200).send({ mensaje: 'Usuario eliminado' })
        })
    }
}

function deleteUserAdmin(req, res) {
    var idUser = req.params.idUser;

    if (req.user.rol === 'admin_general') {
        User.findByIdAndDelete(idUser, (err, userDeleted) => {
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar eliminar usuario' })
            if (!userDeleted) return res.status(500).send({ mensaje: 'ERROR al eliminar al usuario' })

            return res.status(200).send({ mensaje: 'Usuario eliminado' })
        })
    } else {
        return res.status(500).send({ mensaje: 'No puede modificar este usuario' })
    }
}

module.exports = {
    mainStart,
    getAllUsers,
    login,
    registrar,
    editUser,
    deleteUser,
    editUserAdmin,
    getUserID,
    deleteUserAdmin
}