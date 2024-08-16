const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    sale_id: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: null
    },
    is_notify: {
        type: Boolean,
        default: false
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {
    timestamps: false
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
