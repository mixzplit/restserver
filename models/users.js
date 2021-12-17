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
        enum: ['ADMIN_ROLE', 'USER_ROLE']
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

module.exports = model('User', userSchema);