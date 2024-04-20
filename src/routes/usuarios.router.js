const express = require("express");
const router = express.Router();        
const UsuariosModel = require("../models/message.model");


router.get("/", async (req, res) => {
    try {
        const usuarios = await UsuariosModel.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json("Error en el servidor");
    }
})

module.exports = router;