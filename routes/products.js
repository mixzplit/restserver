const { Router } = require('express');
const { check } = require('express-validator');
const { productsGet, productGet, productPost, productPut, productDelete } = require('../controllers/products');
const { categoryIdExists, productIdExists } = require('../helpers/db-validators');
const { validateJWT, validateFields, esAdminRole } = require('../middlewares');


const router = Router();

// Obtener todas categorias - publico
router.get('/', productsGet);

// Obtener una categoria por ID - public
router.get('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(productIdExists),
    validateFields
], productGet);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'El producto debe tener una descripción').not().isEmpty(),
    check('categoria', 'Debe enviar una Categoria').not().isEmpty(),
    check('categoria', 'No es un ID Valido').isMongoId(),
    check('categoria').custom(categoryIdExists),
    validateFields
], productPost);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(productIdExists),
    //check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    //check('categoria', 'Debe enviar una Categoria').not().isEmpty(),
    //check('categoria', 'No es un ID Valido').isMongoId(),
    //check('categoria').custom(categoryIdExists),
    validateFields
], productPut);

// Borrar - privado - cualquier persona con un token valido y si es ADMIN ROLE
router.delete('/:id', [
    validateJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(productIdExists),
    validateFields
], productDelete);


module.exports = router;