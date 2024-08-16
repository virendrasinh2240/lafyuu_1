const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    cart_id: {
        type: Number,
        unique: true,
        autoIncrement: true, // auto-incrementing is not directly supported in MongoDB
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product document
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1 
    },
    total_price: {
        type: Number,
        required: true,
        default: 0 
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User document
        ref: 'User',
        required: true
    }
}, {
    timestamps: false // Can be set to true if you want createdAt and updatedAt fields
});

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
