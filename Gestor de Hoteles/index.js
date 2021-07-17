'use strict'

const mongoose = require("mongoose");
const app = require("./app");
const userControler = require("./src/controlers/user.controler")

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GestorDeHoteles', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('Conexión exitosa en el puerto 3000!');
    userControler.mainStart();
    

    app.listen(3000, function(){
        console.log('El servidor funciona correctamente');
    })    

}).catch(err => console.log(err))
