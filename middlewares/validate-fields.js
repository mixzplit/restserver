const { validationResult } = require('express-validator');

// Validamos el request que viene de la
// ruta, en este caso el Email
const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    // Si llega aqui es por que valido
    // bien el middleware y puede seguir
    // al siguiente
    next();
}


module.exports = {
    validateFields
}