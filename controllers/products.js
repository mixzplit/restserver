const { response } = require("express");
const { Product, Category } = require('../models');

// Todos los productos
const productsGet = async(req, res = response) => {

        const { limite = 5, from = 0 } = req.query; // argumentos opcionales
        const query = { estado: true, disponible: true };

        try {
            const productos = Product.find(query)
                .skip(Number(from))
                .limit(Number(limite))
                .populate('usuario', 'email')
                .populate('categoria', 'name');

            const totalProducts = Product.countDocuments(query);

            // Como hacemos 2 peticiones a la DB llamamos a todas
            // la promesas
            const [total, products] = await Promise.all([
                totalProducts,
                productos,
            ]);

            res.status(200).json({
                total,
                products
            });

        } catch (error) {
            res.status(400).json({
                msg: "Bad Request",
                error: error,
            });
        }
    }
    // Buscar un producto
const productGet = async(req, res = response) => {
    const { id } = req.params;

    const producto = await Product.findById(id)
        .populate('usuario', 'email')
        .populate('categoria', 'name');

    res.status(200).json({
        product: producto
    });

}

// Crear Categoria
const productPost = async(req, res = response) => {
    const { name, precio, description, categoria } = req.body;

    try {
        const productDB = await Product.findOne({ name });
        const categoryDB = await Category.findById(categoria);

        if (productDB) {
            return res.status(400).json({
                msg: `La categoria ${productDB.name} ya existe!`
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                msg: `La categoria ${categoryDB.name} no existe!`
            });
        }

        // Generar la data a guardar
        const data = {
            name: name.toUpperCase(),
            usuario: req.usuario._id,
            precio,
            description,
            categoria: categoryDB._id

        }

        const product = new Product(data);
        // Guardar en DB
        await product.save();

        res.status(201).json(product);

    } catch (error) {
        res.status(400).json({
            msg: 'Oops! algo no anda bien, contacte al Administrador'
        });
    }


}

// Actualizar
const productPut = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const productUpdate = await Product.findByIdAndUpdate(id, data, { new: true });
    res.status(201).json(productUpdate);
}

// Borrar
const productDelete = async(req, res = response) => {
    const { id } = req.params;

    const productDelete = await Product.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.status(201).json(productDelete);
}


module.exports = {
    productsGet,
    productGet,
    productPost,
    productPut,
    productDelete
}