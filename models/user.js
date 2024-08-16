const mongoose = require('../config/dbconnect');

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        unique: true,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    user_name: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    DOB: {
        type: String
    },
    mobile_number: {
        type: String
    },
    user_profile: {
        type: String
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    }
}, {
    timestamps: true
});


userSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'favorites.user_id',
    justOne: false
});

module.exports = mongoose.model('User', userSchema);
