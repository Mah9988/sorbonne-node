const express = require("express");
const router = express.Router();
const userController = require("../../controllers/v1/AdminController");

// Create a new admin
router.post("/admin/register", userController.adminRegister);

// Login admin :
router.post("/admin/login", userController.adminLogin);

// Get all admin
router.get("/admin", userController.getAllAdmins);

// Get a single admin by ID
router.get("/admin/:id", userController.getAdminById);

// admin/checkToken
router.post("/admin/checkToken", userController.checkToken);


module.exports = router;
