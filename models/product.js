const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es Obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    description: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }


});

ProductSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    //category.uid = _id;
    return data;
}

module.exports = model('Proruct', ProductSchema);