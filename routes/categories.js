const { Router } = require('express');
const { check } = require('express-validator');
const { categoriesGet, categorieGet, categoriePost, categoriePut, categorieDelete } = require('../controllers/categories');
const { categoryIdExists } = require('../helpers/db-validators');
// Middlewares
const { validateFields, validateJWT, esAdminRole, tieneRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/categories
 */
// Obtener todas categorias - publico
router.get('/', categoriesGet);

// Obtener una categoria por ID - public
router.get('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(categoryIdExists),
    validateFields
], categorieGet);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], categoriePost);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(categoryIdExists),
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validateFields
], categoriePut);

// Borrar - privado - cualquier persona con un token valido y si es ADMIN ROLE
router.delete('/:id', [
    validateJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(categoryIdExists),
    validateFields
], categorieDelete);


module.exports = router;