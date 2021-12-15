const { Router } = require('express');
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/user');


const router = Router();

// Users GET
router.get('/', usersGet);
// User PUT
router.put('/:id', usersPut);
// User POST
router.post('/', usersPost);

router.delete('/:id', usersDelete);

router.patch('/', usersPatch);


module.exports = router