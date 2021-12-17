const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/user');
const Role = require('../models/role');
// Middlewares
const { validateFields } = require('../middlewares/validate-fields');


const router = Router();

// Users GET
router.get('/', usersGet);
// User PUT
router.put('/:id', usersPut);
// User POST
// Usamos el Middleware de Express-Validation
// para validar los datos
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'Password obligatorio y debe tener minimo 6 caracteres').isLength({ min: 6 }),
    check('email', 'Email no valido').isEmail(),
    check('phone_number', 'Numero de telefono obligatorio').isNumeric().not().isEmpty(),
    //check('role', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(async(role = '') => {
        const roleExists = await Role.findOne({ role });
        if (!roleExists) {
            throw new Error('El rol no esta registrado en DB');
        }
    }),
    validateFields
], usersPost);

router.delete('/:id', usersDelete);

router.patch('/', usersPatch);


module.exports = router