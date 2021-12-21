const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/user');
// Middlewares
const { isValidRole, emailExists, userIdExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');


const router = Router();

// Users GET
router.get('/', usersGet);

// User PUT
router.put('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(userIdExists),
    check('role').custom(isValidRole),
    validateFields
], usersPut);

// User POST
// Usamos el Middleware de Express-Validation
// para validar los datos
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
router.delete('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(userIdExists),
    validateFields
], usersDelete);

router.patch('/', usersPatch);


module.exports = router