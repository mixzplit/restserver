const path = require("path");
const { v4: uuidv4 } = require('uuid');

/**
 * Metodo para subir archivos
 * @param {*} files 
 * @param {*} extPermitidas 
 * @param {*} folder 
 * @returns 
 */
const uploadFileHelper = (files, extPermitidas = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
    // creamos una promesa
    return new Promise((resolve, reject) => {
        // Obtenemos el archivo que recibimos como argumento
        const { archivo } = files;
        // Obtener Extension del Archivo
        const nombreCortado = archivo.name.split('.');
        // obtenemos el ultimo valor del array generado por SPLIT
        const extension = nombreCortado[nombreCortado.length - 1];

        // Valida Extension
        if (!extPermitidas.includes(extension)) {
            return reject(`La extension ${extension} no esta permitida, solo se aceptan ${extPermitidas}`);
        }
        // nombre temporal
        const nombreTemp = uuidv4() + '.' + extension;
        // obtenemos la ruta donde guardaremos la imagen
        const uploadPath = path.join(__dirname, '../uploads/', folder, nombreTemp);
        // movemos el archivo al path seleccionado
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(nombreTemp);
        });
    });

}

module.exports = {
    uploadFileHelper
}