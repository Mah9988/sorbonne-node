const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  lat: { type: String, required: false },
  long: { type: String, required: false },
  user_id: { type: String, required: true },
  createdDate: { type: Date, required: true }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
