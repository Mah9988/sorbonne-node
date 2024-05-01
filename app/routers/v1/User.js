const express = require("express");
const router = express.Router();
const userController = require("../../controllers/v1/userController");

// Create a new User
router.post("/users/register", userController.userRegister);

// Login :
router.post("/users/login", userController.userLogin);

// forget password:
router.post("/users/forget-password", userController.resetPassword);

// change password:
router.post("/users/change-password", userController.changePassword);

// Get all User
router.get("/users", userController.getAllUsers);

// Get a single User by ID
router.get("/users/:id", userController.getUserById);

// Update a User
router.put("/users/:id", userController.updateUser);

// Delete a User
router.delete("/users/:id", userController.deleteUser);

// Update a User
router.put("/users/:id", userController.updateUser);

module.exports = router;
