//const router = require('express').Router();
// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swagger = async(express) => {
    const swaggerSpec = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "RestServer NODEJS",
                version: "1.0.0"
            },
            servers: [{
                url: "http://localhost:8081"
            }]
        },
        apis: ['./routes/user.js'],
    }

    express.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

    //express.get('/api-docs', );

}

module.exports = {
    swagger
}