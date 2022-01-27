const bcryptjs = require("bcryptjs");
const { response } = require("express");
const Usuario = require('../models/users')

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        // Verificar si el usuario esta activo
        if (!usuario.status) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        // Verificar la constraseña
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if (!validPass) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        // Generar JWT


        res.json({
            msg: 'Login ok'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}


module.exports = {
    login
}