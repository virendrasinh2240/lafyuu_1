const express = require("express");
const { addMainNotification, getAllNotifications } = require("../controller/main_notification");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

const mainNotificationRouter = express.Router();

mainNotificationRouter.post("/add/main_notification", auth, checkRole, addMainNotification);
mainNotificationRouter.get("/get/list/notification/type", auth, getAllNotifications);

module.exports = mainNotificationRouter;
