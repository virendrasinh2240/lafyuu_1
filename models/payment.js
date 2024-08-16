const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    payment_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true // Note: Auto-increment is not natively supported by Mongoose. You might need a plugin for this.
    },
    card_number: {
        type: String,
        required: true
    },
    expiration_date: {
        type: String,
        required: true
    },
    security_code: {
        type: Number,
        required: true
    },
    card_holdername: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Assuming user_id is a reference to a User model
        ref: 'User'
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId, // Assuming order_id is a reference to an Order model
        ref: 'Order'
    },
    total_price: {
        type: Number
    },
    payment_status: {
        type: String,
        enum: ['Success', 'Failed'],
        default: 'Success'
    },
    is_notify: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('Payment', paymentSchema);
