const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    notifications_id: {
        type: Number,
        required: true,
        unique: true
    },
    logo: {
        type: mongoose.Schema.Types.Mixed, // To handle JSON data
        required: true
    },
    title: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    is_readable: {
        type: Boolean,
        required: true,
        default: false
    },
    main_notification_id: {
        type: Number, // Assuming it's an integer reference
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: false
});

// Export the model
module.exports = mongoose.model("Notification", notificationSchema);
