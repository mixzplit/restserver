const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
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
    }

});

CategorySchema.methods.toJSON = function() {
    const { __v, ...category } = this.toObject();
    //category.uid = _id;
    return category;
}

module.exports = model('Category', CategorySchema);