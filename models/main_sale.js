const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the main_sale schema
const mainSaleSchema = new Schema({
    sale_name: {
        type: String,
        required: true
    }
}, {
    timestamps: false
});

// Create the model
const MainSale = mongoose.model('MainSale', mainSaleSchema);

module.exports = MainSale;
