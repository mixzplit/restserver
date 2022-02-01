const { response } = require("express");
const { Category } = require('../models');


const categoriesGet = async(req, res = response) => {
    console.log('GET');

    const { limite = 5, from = 0 } = req.query; // argumentos opcionales
    const query = { estado: true };

    try {
        const categories = Category.find(query)
            .skip(Number(from))
            .limit(Number(limite))
            .populate('usuario', 'email');

        const totalCategories = Category.countDocuments(query);

        // Como hacemos 2 peticiones a la DB llamamos a todas
        // la promesas
        const [total, categorias] = await Promise.all([
            totalCategories,
            categories,
        ]);

        res.status(200).json({
            total,
            categorias
        });

    } catch (error) {
        res.status(400).json({
            msg: "Bad Request",
            error: error,
        });
    }
}

const categorieGet = async(req, res = response) => {
    console.log('GET BY ID');
    const { id } = req.params;

    const categorie = await Category.findById(id).populate('usuario', 'email').exec();

    res.status(200).json({
        categorie
    });

}

// Crear Categoria
const categoriePost = async(req, res = response) => {

    const name = req.body.name.toUpperCase();

    try {
        const categoryDB = await Category.findOne({ name });

        if (categoryDB) {
            return res.status(400).json({
                msg: `La categoria ${categoryDB.name} ya existe!`
            });
        }

        // Generar la data a guardar
        const data = {
            name,
            usuario: req.usuario._id
        }

        const category = new Category(data);
        // Guardar en DB
        await category.save();

        res.status(201).json(category);

    } catch (error) {
        res.status(400).json({
            msg: 'Oops! algo no anda bien, contacte al Administrador'
        })
    }


}

// Actualizar
const categoriePut = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.usuario = req.usuario._id;

    const categoryUpdate = await Category.findByIdAndUpdate(id, data, { new: true });
    res.status(201).json(categoryUpdate);
}

// Borrar
const categorieDelete = async(req, res = response) => {
    const { id } = req.params;

    const categoryDelete = await Category.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.status(201).json(categoryDelete);
}


module.exports = {
    categoriesGet,
    categorieGet,
    categoriePost,
    categoriePut,
    categorieDelete
}