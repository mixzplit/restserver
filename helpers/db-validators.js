const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/users');

const isValidRole = async(role = '') => {
    if (role != '') {
        const roleExists = await Role.findOne({ role });
        if (!roleExists) {
            throw new Error(`El rol ${role} no esta registrado en DB`);
        }
    }
}

const emailExists = async(email) => {
    const findEmail = await User.findOne({ email });
    if (findEmail) {
        throw new Error(`El email: ${email} ya existe!!`);
    }
}

const userIdExists = async(id) => {
    const findById = await User.findById(id);
    if (!findById) {
        throw new Error(`El id no existe!!`);
    }
}

const categoryIdExists = async(id) => {
    const findById = await Category.findById(id);
    if (!findById) {
        throw new Error(`El id no existe!!`);
    }
}

const productIdExists = async(id) => {
    const findById = await Product.findById(id);
    if (!findById) {
        throw new Error(`El id no existe!!`);
    }
}

module.exports = {
    isValidRole,
    emailExists,
    userIdExists,
    categoryIdExists,
    productIdExists
}