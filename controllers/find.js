const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Category, Product } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


const buscarUsuarios = async(termino = '', res = response) => {
    // buscamos si en el 'termino' viene un ID Valido Mongo
    const esMongoID = ObjectId.isValid(termino); // MongoID Valid
    // si es valido
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            // si existe el usuario enviamos un array con la info, de lo contrao un array vacio
            results: (usuario) ? [usuario] : []
        });
    }

    // creamos una expresion regular para que no sea case sensitve
    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.status(200).json({
        results: usuarios
    });

}


const buscarCategorias = async(termino = '', res = response) => {
    // buscamos si en el 'termino' viene un ID Valido Mongo
    const esMongoID = ObjectId.isValid(termino); // MongoID Valid
    // si es valido
    if (esMongoID) {
        const categoria = await Category.findById(termino);
        return res.status(200).json({
            // si existe el usuario enviamos un array con la info, de lo contrao un array vacio
            results: (categoria) ? [categoria] : []
        });
    }

    // creamos una expresion regular para que no sea case sensitve
    const regex = new RegExp(termino, 'i');

    const categorias = await Category.find({
        name: regex,
        $and: [{ estado: true }]
    });

    res.status(200).json({
        results: categorias
    });

}

const buscarProductos = async(termino = '', res = response) => {
    // buscamos si en el 'termino' viene un ID Valido Mongo
    const esMongoID = ObjectId.isValid(termino); // MongoID Valid
    // si es valido
    if (esMongoID) {
        const producto = await Product.findById(termino).populate('categoria', 'name');
        return res.status(200).json({
            // si existe el usuario enviamos un array con la info, de lo contrao un array vacio
            results: (producto) ? [producto] : []
        });
    }

    // creamos una expresion regular para que no sea case sensitve
    const regex = new RegExp(termino, 'i');

    const productos = await Product.find({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ estado: true }, { disponible: true }]
    }).populate('categoria', 'name');

    res.status(200).json({
        results: productos
    });

}


const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `La coleccion ${coleccion} no existe!`
        })
    }

    switch (coleccion) {
        case "usuarios":
            buscarUsuarios(termino, res);
            break;
        case "categorias":
            buscarCategorias(termino, res);
            break;
        case "productos":
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Algo fallo...'
            })
            break;
    }


}

module.exports = {
    buscar
}