const MainNotification = require("../models/main_notification"); // Mongoose Model
const Notification = require("../models/notification"); // Mongoose Model

// Get all notifications based on query parameters
exports.getAllNotifications = async (req, res, next) => {
    try {
        const { main_notification_id, is_readable } = req.query;

        // Helper function to convert string to boolean
        function convertStringToBoolean(value) {
            if (typeof value === 'undefined') {
                return false;
            }
            if (value === "true") {
                return true;
            } else if (value === "false") {
                return false;
            } else {
                throw new Error("is_readable must be a boolean value");
            }
        }

        const isReadable = convertStringToBoolean(is_readable);

        if (isReadable !== undefined && typeof isReadable !== 'boolean') {
            return res.status(400).json({
                message: "is_readable parameter must be a boolean value",
                code: 400,
                error: true
            });
        }

        let notifications = [];
        let unreadNotificationCount = 0;

        if (main_notification_id) {
            // Fetch notifications based on the main_notification_id and is_readable status
            const result = await Notification.find({
                main_notification_id,
                is_readable: isReadable
            }).select('notifications_id logo title main_notification_id is_readable descriptions');

            if (result.length === 0) {
                throw new Error("No notifications for the provided main_notification_id");
            }

            notifications = result;

            // Count unread notifications
            unreadNotificationCount = await Notification.countDocuments({
                main_notification_id,
                is_readable: false
            });
        }

        res.status(200).json({
            message: "Successfully fetched notifications",
            code: 200,
            error: false,
            data: {
                notifications,
                unreadNotificationCount
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update notification data
exports.updatenotification_data = async (req, res, next) => {
    try {
        const { notifications_id, main_notification_id, is_readable } = req.body;

        if (!notifications_id) {
            throw new Error("Notification ID is required");
        }

        // Find the notification by ID
        const notification = await Notification.findOne({ notifications_id });

        if (!notification) {
            return res.status(400).json({
                message: "Provided notifications_id does not exist",
                code: 400,
                error: true
            });
        }

        // Find the main notification by ID if provided
        if (main_notification_id) {
            const main = await MainNotification.findOne({ main_notification_id });
            if (!main) {
                throw new Error("Provided main_notification_id does not exist");
            }
            notification.main_notification_id = main_notification_id;
        }

        // Update the is_readable field if provided
        if (typeof is_readable !== 'boolean') {
            throw new Error('Please provide a valid is_readable boolean value');
        }
        if (is_readable !== undefined && is_readable !== null) {
            notification.is_readable = is_readable;
        }

        // Save the updated notification
        await notification.save();

        res.status(200).json({
            message: "Notification data updated successfully",
            code: 200,
            error: false,
            data: {
                notification
            }
        });
    } catch (error) {
        next(error);
    }
};
