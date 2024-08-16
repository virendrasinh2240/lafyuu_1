const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MainNotificationSchema = new Schema({
    main_notification_id: {
        type: Schema.Types.ObjectId,
        auto: true,
        unique: true,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    notification_name: {
        type: String,
        required: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('MainNotification', MainNotificationSchema);
