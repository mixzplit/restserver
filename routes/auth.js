const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT } = require('../middlewares');
const { login, googleSignIn, renovarToken } = require('../controllers/auth');

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
router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La constraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'id_token es obligatorio').not().isEmpty(),
    validateFields
], googleSignIn);

// Validar JWT
router.get('/', validateJWT, renovarToken)

module.exports = router;