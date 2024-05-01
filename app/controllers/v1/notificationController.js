const FCM = require("fcm-node");
const User = require("../../models/User");
const Child = require("../../models/Child");
const Qr = require("../../models/Qr");
const Notification = require("../../models/Notification");

//api for send notification
// ** NOTE can use topic from devices or token here use topic
exports.sendNotification = async (req, res) => {
  try {
    const userId = req.body.id;
    const qrCode = req.body.qrCode;
    const createdDate = new Date();
    const user = await User.findById(userId);
    const qr = await Qr.findOne({ qrCode });

    if (!user) {
      return res.status(404).send("User not found");
    }
    if (!qr) {
      return res.status(404).send("QR not found");
    }
    const child = await Child.findOne({ qrID: qr._id })
    if (!child) {
      return res.status(404).send("Child not found");
    }
    
    const userTokens = user?.notification_token;
    const fcm = new FCM(process.env.SERVER_KEY_NOTIFICATION);
    const notificationArray = [];

    const messages = userTokens?.map((userToken) => ({
      to: userToken,
      notification: {
        title: 'readNotification',
        body: child.name,
        sound: "default",
        click_action: "FCM_Plugin_activity",
        icon: "fcm_push_icon",
      },
    }));

    const notificationsPromises = messages.map((message) => {
      return new Promise((resolve) => {
        fcm.send(message, (err, response) => {
          if (err) {
            console.log("Error sending notification:", err);
            // Handle the error as needed
            resolve(null);
          } else {
            notificationArray.push(response);
            resolve(response);
          }
        });
      });
    });

    // Wait for all notifications to be sent before proceeding
    await Promise.all(notificationsPromises);

    // Check if at least one notification was successful
    const successfulNotifications = notificationArray.filter(Boolean);

    if (successfulNotifications.length > 0) {
      // Save a single notification in the database
      const notification = new Notification({
        title: 'readNotification',
        message: child.name,
        lat: req.body.lat,
        long: req.body.long,
        user_id: req.body.id,
        createdDate,
      });

      await notification.save();
      return res.status(200).json({ status: "success" });
    } else {
      const notification = new Notification({
        title: 'readNotification',
        message: child.name,
        lat: req.body.lat,
        long: req.body.long,
        user_id: req.body.id,
        createdDate,
      });

      await notification.save();
      return res
        .status(500)
        .json({ status: "error", message: "Failed to send any notifications" });
    }
  } catch (error) {
    console.log("error sendNotification ", error);
    return res.status(500).send("Internal Server Error");
  }
};

// update a notification token
exports.updateNotificationToken = async (req, res) => {
  const userId = req.body.user_id;
  const notification_token = req.body.notification_token;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.notification_token.includes(notification_token)) {
      // If it's not in the array, update the array with the new token
      user.notification_token.push(notification_token);

      // Save the updated user document
      const updatedUser = await user.save();

      res.json(updatedUser);
    } else {
      // If the token is already in the array, return the current user document
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating notification field" });
  }
};

// update a notification token
exports.getNotificationUserId = async (req, res) => {
  const userId = req.params.id;
  Notification.find({ user_id: userId })
    .then((result) => {
      if (!result) {
        res.status(404).send("notification not found");
      } else {
        console.log("result getNotificationUserId", result);
        res.send(result);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error get notification by user id");
    });
};
