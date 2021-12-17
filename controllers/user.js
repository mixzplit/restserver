const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Model
const User = require('../models/users');


// GET
// Usamos query para obtener parametros en la URL
const usersGet = (req = request, res = response) => {

    const { q, nombre, apiKey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - Controller',
        q,
        nombre,
        apiKey,
        page,
        limit
    });
}

// PUT
const usersPut = (req, res = response) => {
    const { id } = req.params;
    console.log(id);
    res.json({
        msg: 'put API - Controller',
        id
    });
}

// POST
const usersPost = async(req, res = response) => {

    // body request
    const { name, email, password, phone_number, role } = req.body;
    const user = new User({ name, email, password, phone_number, role });

    // Verificar si el correo ya existe
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).json({
            msg: 'Email ya existe!!'
        });
    }

    //Encriptar password
    const salt = bcrypt.genSaltSync(10); //Complejidad de Encriptacion
    // Aqui asignamos la pass encriptada a la propiedad de nuestro objeto
    user.password = bcrypt.hashSync(password, salt);

    // SaveDB
    await user.save();

    res.json({
        msg: 'post API - Controller',
        user
    });

}

// DELETE
const usersDelete = (req, res = response) => {
    const { id } = req.params;
    res.json({
        msg: 'delete API - Controller',
        id
    });
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controller'
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersDelete,
    usersPost,
    usersPatch
}