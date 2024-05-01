const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  qrCode: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const Qr = mongoose.model("Qr", qrSchema);

module.exports = Qr;

