const { response, request } = require('express');

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
const usersPost = (req, res = response) => {
    // body request
    const body = req.body;
    res.json({
        msg: 'post API - Controller',
        body
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