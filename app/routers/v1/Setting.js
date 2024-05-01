const express = require("express");
const router = express.Router();
const settingController = require("../../controllers/v1/settingController");

// Get all setting
router.get("/setting", settingController.getAllKey);

// Create a new setting
router.post("/setting", settingController.createKey);

router.get("/setting/:key", settingController.getKeyByName);

module.exports = router;
