const express = require("express");
const router = express.Router();
const childController = require("../../controllers/v1/childController");
const authenticateToken = require("../../helpers/authenticate");

//get all childs
router.get("/childs", authenticateToken, childController.getAllChild);

//create new child
router.post("/childs", childController.createChild);

//for get child by user id
router.get("/childs/:id", childController.getChildDataByUserId);

//for get child by id
router.get("/child/:id", childController.getOneChild);

//update child by  id
router.put("/childs/:id", childController.updateChild);

//update child by  id
router.post("/childs/checkQR", childController.checkQRById);

module.exports = router;
