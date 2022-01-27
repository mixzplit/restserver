const { response } = require('express');
//Model
const User = require('../models/users');
const jwt = require('jsonwebtoken');

// Los middlewares reciben 3 parametros, next = si esta todo ok sigue con el siguiente
const validateJWT = async(req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'Unauthorized'
        })
    }

    try {
        //verificamos el token y desestructuramos
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);

        const usuario = await User.findById(uid);
        // Si el usuario no existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        // verificamos si el usuario tiene status: true
        if (!usuario.status) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}


module.exports = {
    validateJWT
}