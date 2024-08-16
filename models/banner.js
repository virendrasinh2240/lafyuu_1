const mongoose = require("../config/dbconnect");

const bannerSchema = new mongoose.Schema({
    banner_id: {
        type: Number,
        unique: true,
        // Mongoose uses an auto-generated ObjectId as the primary key (_id), so this field may be optional
    },
    banner_title: {
        type: String,
        required: true, // Use 'required' instead of 'allowNull: false'
    },
    banner_image: {
        type: String,
        required: true,
    },
    banner_countdown: {
        type: Date,
        required: true,
    },
    countdown_status: {
        type: Boolean,
        default: true, // Use 'default' instead of 'defaultValue'
    },
    banner_status: {
        type: Boolean,
        default: true, // Use 'default' instead of 'defaultValue'
    }
}, {
    timestamps: false // No 'createdAt' and 'updatedAt' fields will be added
});

module.exports = mongoose.model("Banner", bannerSchema);
