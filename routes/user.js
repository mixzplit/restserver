const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/user');
// Middlewares
const { isValidRole, emailExists, userIdExists } = require('../helpers/db-validators');

const { validateFields, validateJWT, esAdminRole, tieneRole } = require('../middlewares');

const router = Router();

/**
 * @swagger 
 * components:
 *   schemas:
 *      User:
 *        type: object
 *        properties:
 *          name: 
 *              type: string
 *              description: user name
 *          email:
 *              type: string
 *              description: user email
 *          password:
 *              type: string
 *              description: usar password
 *          image:
 *              type: string
 *              description: avatar
 *          phone_number:
 *              type: integer
 *              description: phone number
 *          role:
 *              type: string
 *              description: role
 *          status:
 *              type: boolean
 *              description: user status
 *          google_auth:
 *              type: boolean
 *          facebook_auth:
 *              type: boolean
 *        required:
 *          - name
 *          - email
 *          - password
 *          - phone_number
 *        example:
 *          name: Test 1,
 *          email: test1@gmail.com
 *          password: 1234567A
 *          image: ruta-imagen
 *          role: VENTAS_ROLE
 *          phone_number: 1159358901
 *       
 */

// Users GET
/**
 * @swagger
 * /api/users:
 *      get:
 *          description: Get All Users
 *          tags: [User]
 *          summary: Get All Users
 *          parameters:
 *          - in: query
 *            name: limite
 *            type: integer
 *            description: The numbers of items to return.
 *          - in: query
 *            name: from
 *            type: integer
 *            description: The number of items to skip before starting to collect the result set.            
 *          responses:
 *              200:
 *                  description: Success      
 */
router.get('/', usersGet);

// User PUT
/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *      description: Update a user
 *      summary: Update a user
 *      tags: [User]
 *      parameters:
 *      - name: id
 *        description: id user
 *        in: path
 *        required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object 
 *                      $ref: '#components/schemas/User'
 *      responses:
 *          201:
 *              description: User updated
 *          400:
 *              description: Bad Request
 */
router.put('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(userIdExists),
    check('role').custom(isValidRole),
    validateFields
], usersPut);

// User POST
// Usamos el Middleware de Express-Validation
// para validar los datos
/**
 * @swagger
 * /api/users:
 *  post:
 *   description: Create a new User   
 *   summary: Create a new User
 *   tags: [User]
 *   requestBody:
 *     required: true
 *     content:
 *        application/json:
 *           schema:
 *             type: object 
 *             $ref: '#components/schemas/User' 
 *   responses:
 *      201:
 *          description: Created
 *      400:
 *          description: Bad Request      
 *      
 */
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'Password obligatorio y debe tener minimo 6 caracteres').isLength({ min: 6 }),
    check('email', 'Email no valido').isEmail(),
    check('email').custom(emailExists),
    check('phone_number', 'Numero de telefono obligatorio').isNumeric().not().isEmpty().isLength({ min: 10 }),
    //check('role', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    validateFields
], usersPost);

// User DELETE
/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *      description: Delete a User
 *      summary: Delete a User
 *      tags: [User]
 *      parameters:
 *      - name: id
 *        description: id user
 *        in: path
 *        required: true
 *      responses:
 *          200: 
 *              description: Deleted User
 *          400:
 *              description: Bad Request
 *    
 */
router.delete('/:id', [
    validateJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(userIdExists),
    validateFields
], usersDelete);

router.patch('/', usersPatch);


module.exports = router