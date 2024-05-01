const mongoose = require("mongoose");
const Child = require("../../models/Child");
const User = require("../../models/User");
const Qr = require("../../models/Qr");
const Admin = require("../../models/Admin");

exports.getCounts = async (req, res) => {
  const childsPromise = Child.find({}).populate("qrID");
  const userPromise = User.find({});
  const QrsPromise = Qr.find({});
  const adminsPromise = Admin.find({});

  try {
    const [childs, user, Qrs, admins] = await Promise.all([
      childsPromise,
      userPromise,
      QrsPromise,
      adminsPromise,
    ]);
    const qrUsed = childs?.map((item) => {
      return item?.qrID;
    });
    const childCount = childs.length;
    const qrCount = Qrs.length;
    const qrUsedCount = qrUsed.length;
    const qrNotUsedCount = qrCount - qrUsedCount;
    const userCount = user.length;
    const adminCount = admins.length;

    res.status(200).json({
      childCount,
      qrCount,
      qrNotUsedCount,
      qrUsedCount,
      userCount,
      adminCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
