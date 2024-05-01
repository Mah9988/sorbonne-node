const usersRoutes = require("./v1/User");
const qrRoutes = require("./v1/Qr");
const childRoutes = require("./v1/Child");
const adminRoutes = require("./v1/Admin");
const settingRoutes = require("./v1/Setting");
const notificationRoutes = require("./v1/Notification");
const dashRoutes = require("./v1/Dashboard");
module.exports = {
  qrRoutes,
  usersRoutes,
  childRoutes,
  adminRoutes,
  notificationRoutes,
  settingRoutes, 
  dashRoutes
};
