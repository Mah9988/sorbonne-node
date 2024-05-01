const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  type: { type: String, required: true },
  value: { type: String, required: true },
  createdDate: { type: Date, required: true },
  updatedDate: { type: Date, required: true },

});

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
