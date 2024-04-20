const mongoose = require ("mongoose");

mongoose.connect("")
    .then(() => console.log("Conexion establecida"))
    .catch(() => console.log("Error en la conexion"))