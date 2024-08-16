const MainNotification = require("../models/main_notification");
const { checkValidStringType } = require("../utils/validation");

// Add Main Notification
exports.addMainNotification = async (req, res, next) => {
    try {
        const { notification_name } = req.body;

        if (!notification_name) {
            throw new Error("Please enter notification name");
        }

        checkValidStringType(notification_name);

        const newNotification = new MainNotification({
            notification_name,
        });

        await newNotification.save();

        return res.status(200).json({
            status: {
                message: "Successfully added notification data",
                code: 200,
                error: false
            },
            data: {
                newNotification
            }
        });
    } catch (error) {
        next(error);
    }
}

// Get All Main Notifications
exports.getAllNotifications = async (req, res, next) => {
    try {
        const notifications = await MainNotification.find();

        if (notifications.length === 0) {
            throw new Error("No available notification types");
        }

        return res.status(200).json({
            status: {
                message: "Successfully fetched all notification types",
                code: 200,
                error: false
            },
            data: notifications
        });
    } catch (error) {
        next(error);
    }
}
