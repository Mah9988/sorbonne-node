const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/v1/notificationController");

// send notification
router.post("/send/notification", notificationController.sendNotification);
// update notification
router.post(
  "/update/notification/history",
  notificationController.updateNotificationToken
);
//for get notification by user id
router.get("/notification/:id", notificationController.getNotificationUserId);

module.exports = router;

