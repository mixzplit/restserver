// imports
const cors = require('cors')
const express = require('express');

/**
 * @class Clase para manejar el servidor
 * @author David Acurero
 */
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        // Lectura y parseo del Body
        this.app.use(express.json());

        // Servir contenido estatico
        // Al hacer esto la linea 9 queda sin efecto
        // ya que directamente carga el index que
        // creamos
        this.app.use(express.static('public'));
    }

    routes() {
        // user Routes
        this.app.use(this.usersPath, require('../routes/user'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }

}

module.exports = Server;