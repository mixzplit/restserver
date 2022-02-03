const { response } = require("express");

const validateFileEmpty = (req, res = response, next) => {

    /** Validamos que venga informacion en el request files */
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: 'No files were uploaded.' });
    }

    next();
}

module.exports = {
    validateFileEmpty
}