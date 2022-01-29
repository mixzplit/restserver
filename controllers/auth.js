const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { googleVerify } = require("../helpers/google-verify");
const { generarJWT } = require("../helpers/jwt-generator");
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
        const token = await generarJWT(usuario.id);


        res.json({
            msg: 'Login ok',
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        const { email, name, image } = await googleVerify(id_token);

        // Buscamos en nuestro modelo
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            // creamos el usuario
            const data = {
                email,
                name,
                password: ':p',
                image,
                phone_number: '1234567890',
                google_auth: true,
                role: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // si el estado es false
        if (!usuario.status) {
            return res.status(401).json({
                msg: 'Usuario bloqueado, hable con el administrador'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Todo OK',
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}


module.exports = {
    login,
    googleSignIn
}