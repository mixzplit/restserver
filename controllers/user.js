const { response, request } = require('express');
const { status } = require('express/lib/response');
const bcrypt = require('bcryptjs');
//Model
const User = require('../models/users');


// GET
// Usamos query para obtener parametros en la URL
const usersGet = async(req = request, res = response) => {
    // const { q, nombre, apiKey, page = 1, limit } = req.query;

    //desestructuramos el request
    const { limite = 5, from = 0 } = req.query; // argumentos opcionales
    const query = { status: true };
    try {
        const usuarios = User.find(query)
            .skip(Number(from))
            .limit(Number(limite));

        const totalUsuarios = User.countDocuments(query);

        // Aqui usamos la funcion para llamar a todas
        // la promesas simultaneamente y ademas hacemos
        // una desestructuracion de objetos para armar la respuesta
        // tal como esta, donde la respuesta se armara en el orden
        // de la desestructuracion
        const [total, users] = await Promise.all([
            totalUsuarios,
            usuarios
        ])

        res.json({
            total,
            users
        });

    } catch (error) {
        res.status(400).json({
            msg: "Bad Request",
            error: error,
        });
    }

}

// PUT
const usersPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, email, google_auth, ...user } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync(10); //Complejidad de Encriptacion
        // Aqui asignamos la pass encriptada a la propiedad de nuestro objeto
        user.password = bcrypt.hashSync(password, salt);
    }

    const userUpdate = await User.findByIdAndUpdate(id, user);
    res.status(201).json(userUpdate);
}

// POST
const usersPost = async(req, res = response) => {

    // body request
    const { name, email, password, phone_number, role } = req.body;
    const user = new User({ name, email, password, phone_number, role });

    // Verificar si el correo ya existe


    //Encriptar password
    const salt = bcrypt.genSaltSync(10); //Complejidad de Encriptacion
    // Aqui asignamos la pass encriptada a la propiedad de nuestro objeto
    user.password = bcrypt.hashSync(password, salt);

    // SaveDB
    await user.save();

    res.status(201).json({
        msg: 'post API - Controller',
        user
    });

}

// DELETE
const usersDelete = async(req, res = response) => {
    const { id } = req.params;
    // Borrar usuario definitivamente
    //const user = User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, { status: false });
    //const userAuth = req.usuario;
    res.json(user);
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