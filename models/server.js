// imports
const cors = require('cors')
const express = require('express');
const { dbConn } = require('../db/config');
const { swagger } = require('../helpers/swagger')
    /**
     * @class Clase para manejar el servidor
     * @author David Acurero
     */
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // Objeto Rutas
        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            find: '/api/find', // busquedas
            products: '/api/products',
            users: '/api/users',
            //swagger:    '/api-docs',
        }


        // Database Connection
        this.initDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

        this.swagger(this.app);
    }

    // MongoDB Connection
    async initDB() {
        await dbConn();
    }

    // Swagger
    async swagger(app) {
        await swagger(app);
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

        this.app.use(this.paths.auth, require('../routes/auth'));
        // buscar
        this.app.use(this.paths.find, require('../routes/find'));
        // user Routes
        this.app.use(this.paths.users, require('../routes/user'));
        // products Routes
        this.app.use(this.paths.products, require('../routes/products'));
        // caterories routes
        this.app.use(this.paths.categories, require('../routes/categories'));
        //swagger
        //this.app.use(this.swaggerPath, require('../helpers/swagger'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }

}

module.exports = Server;