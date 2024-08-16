const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',  // Reference to the Product model
        required: true
    }
}, {
    timestamps: false
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
