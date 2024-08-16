const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: {
        type: Number,
        required: true,
        unique: true
    },
    user_id: {
        type: Number,
        required: true
    },
    products: {
        type: mongoose.Schema.Types.Mixed, // Used to store JSON data
        required: true
    },
    date_shipping: {
        type: Date,
        default: Date.now, // Auto-generate the current date and time
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    address_id: {
        type: Number,
        required: true
    },
    order_status: {
        type: String,
        enum: ['Packing', 'Shipping', 'Arriving', 'Success'],
        default: 'Packing',
        required: true
    }
}, {
    timestamps: false
});

// Export the model
module.exports = mongoose.model('Order', orderSchema);
