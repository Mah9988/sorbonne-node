const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: String, required: true },
  schoolName: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: false },
  childrenDiseases: { type: String, required: true },
  safetyMeasures: { type: String, required: true },
  bloodType: { type: String, required: true },
  fatherPhone: { type: String, required: true },
  motherPhone: { type: String, required: false },
  city: { type: String, required: true },
  area: { type: String, required: true },
  streetName: { type: String, required: true },
  buildingNumber: { type: String, required: true },
  specialMarque: { type: String, required: true },
  profilePicture: { type: String, required: false },
  confirmRoles: { type: Boolean, required: true },
  isPublic: { type: Boolean, required: false },
  expirationDate : { type: Date, required: true },
  isActive: { type: Boolean, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  qrID: { type: mongoose.Schema.Types.ObjectId, ref: "Qr", unique: true }, // relation one to one
});

const Child = mongoose.model("Child", childSchema);

module.exports = Child;
