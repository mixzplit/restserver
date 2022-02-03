const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, actualizarImagen, showImage, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validateFileEmpty } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();


/**
 * @swagger 
 * components:
 *   schemas:
 *      Auth:
 *        type: object
 *        properties:
 *          email:
 *              type: string
 *              description: user email
 *          password:
 *              type: string
 *              description: user password
 *        required:
 *          - email
 *          - password
 *        example:
 *          email: test1@gmail.com
 *          password: 1234567A
 */


/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    description: Auth User
 *    summary: Auth User
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object 
 *            $ref: '#components/schemas/Auth' 
 *    responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request      
 */
router.post('/', validateFileEmpty, uploadFile);

router.put('/:coleccion/:id', [
    validateFileEmpty,
    check('id', 'No es un ID Valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'products'])), // verificamos nuestras colecciones
    validateFields
], actualizarImagenCloudinary);
//actualizarImagen

router.get('/:coleccion/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'products'])), // verificamos nuestras colecciones
    validateFields
], showImage)

module.exports = router;