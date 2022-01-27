const { response } = require("express");
const { json } = require("express/lib/response");

const esAdminRole = (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere validar el Rol sin validar un token'
        });
    }
    const { role, name } = req.usuario;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El usuario ${name} no tiene permisos para ejecutar esta acción`
        });
    }

    next();
}

// recibimos los roles con el operador REST
const tieneRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere validar el Rol sin validar un token'
            });
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: 'Rol no autorizado para esta acción'
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}