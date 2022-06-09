const middlewareController = require("../controllers/middlewareController");
const authController = require("../controllers/userControllers");

const router = require("express").Router();
//get all user
router.get("/", middlewareController.verifyToken, authController.getAllUser);

// delete user
router.delete("/delete/:id", middlewareController.verifyTokenAdmin, authController.deleteUser);
module.exports = router; 