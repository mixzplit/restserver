const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const generarJWT = async(uid = '') => {

    return new Promise((resolve, reject) => {
        const payload = { uid }

        jwt.sign(payload, process.env.SECRET_OR_PRIVATE_KEY, {
                expiresIn: '1h'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el Token');
                } else {
                    resolve(token);
                }
            })
    });

}

const validarJWT = async( token = '') => {
    try {
        if(token < 10){
            return null
        }

        const { uid } = jwt.verify(token,process.env.SECRET_OR_PRIVATE_KEY)
        const usuario = await Usuario.findById(uid);

        if(usuario){ // Validamos si existe el usuario
            return usuario;
        }else{
            return null
        }

    } catch (error) {
        return null   
    }
}

module.exports = {
    generarJWT,
    validarJWT
}