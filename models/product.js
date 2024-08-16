const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');
const Favorites = require('../models/favourite');

const ProductSchema = new Schema({
    product_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    product_images: {
        type: [String], // Assuming images are stored as URLs or paths
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    color_ids: {
        type: [Number], // Array of color IDs
        required: true
    },
    size_ids: {
        type: [Number], // Array of size IDs
        required: true
    },
    product_rating: {
        type: Number,
        default: 0
    },
    product_price: {
        type: Number,
        required: true
    },
    product_specification: {
        type: String,
        required: true
    },
    active_status: {
        type: Boolean,
        default: true
    },
    is_notify: {
        type: Boolean,
        default: false
    },
    category_id: {
        type: Number // Assuming category_id is a number
    }
}, {
    timestamps: false
});

// Define relationships (manual management in MongoDB)
ProductSchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'favorites.product_id',
    justOne: false
});



const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
