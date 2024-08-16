const express = require("express");
const { getAllNotifications, updatenotification_data } = require("../controller/notification");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

// Initialize the router
const NotificationsRouter = express.Router();

// Define the routes
NotificationsRouter.get("/get/allnotifications", auth, getAllNotifications);
NotificationsRouter.post("/update/notification_data", auth, checkRole, updatenotification_data);

// Export the router
module.exports = NotificationsRouter;
