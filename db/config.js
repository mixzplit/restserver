const mongoose = require('mongoose');

const dbConn = async() => {

    try {
        // mongoose devuelve una promesa, pero
        // tenemos al tener el ASYNC simplemente
        // usamos el await
        mongoose.connect(process.env.MONGODB_CNN_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true

        });

        console.log('Conexion Establecida');

    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexion');
    }

}


module.exports = {
    dbConn
}