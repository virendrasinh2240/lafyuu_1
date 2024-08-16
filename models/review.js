const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product_review_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    rate: {
        type: Number,
        required: true,
        default: 0
    },
    review_detail: {
        type: mongoose.Schema.Types.Mixed, // Use Mixed type for JSON data
        required: true
    },
    image: {
        type: String
    },
    product_id: {
        type: Number,
        required: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('Review', reviewSchema);
