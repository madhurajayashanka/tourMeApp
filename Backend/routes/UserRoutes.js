const express = require("express");
const UserController = require("../controllers/users");

const router = express.Router();

router.post("/save", UserController.saveUser);
router.post("/login", UserController.userLogin);

module.exports = router;
