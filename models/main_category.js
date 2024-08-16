const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mainCategorySchema = new Schema({
    main_category_name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const MainCategory = mongoose.model('MainCategory', mainCategorySchema);

module.exports = MainCategory;
