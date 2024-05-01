const express = require("express");
const router = express.Router();
const qrController = require("../../controllers/v1/qrController");

// Create a new qr
router.post("/qr/create", qrController.createQR);
// get all qr
router.get("/qr", qrController.getAllQR);
// Get a QR by ID
router.get("/qr/:id", qrController.getQRById);
// Get a child by QR ID
router.get("/child/qr/:id", qrController.getChildDataByQr);
router.post("/qr/check", qrController.checkQrCode);
router.get("/used", qrController.getQRUesd);
router.get("/not/used", qrController.getNotUsed);

module.exports = router;
