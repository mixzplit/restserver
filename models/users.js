const { Schema, model } = require('mongoose');


const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'Email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password es obligatorio'],
    },
    image: {
        type: String
    },
    phone_number: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    facebook_auth: {
        type: Boolean,
        default: false
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', deletedAd: 'deleted_at' } });


// @override method
// Debe ser una funcion normal y no una funcion de flecha
// por que vamos a usar el objeto this y una funcion de
// fecha apunta el this fuera de la funcion y por eso
// usamos la funcion normal para obtener la instancia creada
userSchema.methods.toJSON = function() {
    // desestructuramos y sacamos las propiedades
    // __v y password y el resto lo mandamos en user y
    // lo retornamos
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', userSchema);