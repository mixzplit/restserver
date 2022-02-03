const { response } = require("express");
const { uploadFileHelper } = require("../helpers");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { Usuario, Product } = require('../models');

const uploadFile = async(req, res = response) => {
    try {
        const name = await uploadFileHelper(req.files, ['json', 'txt']);
        res.status(200).json({ name });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const actualizarImagen = async(req, res = response) => {
    const { coleccion, id } = req.params

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Error!!' });
    }

    // Limpiar imagenes previas
    if (modelo.image) {
        // Borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.image);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    // actualizamos imagen de la coleccion seleccionada
    const name = await uploadFileHelper(req.files, undefined, coleccion);
    modelo.image = name;
    console.log(modelo);

    await modelo.save();

    res.status(200).json(modelo);
}

const actualizarImagenCloudinary = async(req, res = response) => {
    const { coleccion, id } = req.params

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Error!!' });
    }

    // Limpiar imagenes previas
    if (modelo.image) {
        const nameArr = modelo.image.split('/');
        const name = nameArr[nameArr.length - 1];
        // Desestructuramos
        const [public_id, ext] = name.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    // Cloudinary nos devuelve una Promesa. Podemos desestructurar
    // la repsuesta y obtener solo lo que necesitamos
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    // actualizamos imagen de la coleccion seleccionada
    //const name = await uploadFileHelper(req.files, undefined, coleccion);
    // agregamos el secure_url a nuestra coleccion
    modelo.image = secure_url;
    // guardamos
    await modelo.save();

    res.status(200).json(modelo);
}



const showImage = async(req, res = response) => {
    const { coleccion, id } = req.params
    let pathImagen = '';
    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Error!!' });
    }

    // Limpiar imagenes previas
    if (modelo.image) {
        // Borrar imagen del servidor
        pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.image);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    //res.status(200).json({ msg: 'Falta el placeholder' });
    res.sendFile(pathImagen);
}

module.exports = {
    uploadFile,
    actualizarImagen,
    showImage,
    actualizarImagenCloudinary
}