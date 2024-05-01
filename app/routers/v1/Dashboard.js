const express = require("express");
const router = express.Router();
const dashController = require("../../controllers/v1/dashboardController");

// get all count of system
router.get("/dashboard/count", dashController.getCounts);

module.exports = router;
