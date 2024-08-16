const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    region: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    street_address: {
        type: String,
        required: true,
    },
    street_address2: {
        type: String,
        // required: true, // Uncomment if needed
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip_code: {
        type: Number,
        required: true,
    },
    phone_number: {
        type: String,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: false
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
