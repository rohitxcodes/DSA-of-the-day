const express = require("express");

const { loginUser, getUsers } = require("../controllers/userController");
const { validateUserLogin } = require("../middleware/requestValidation");

const router = express.Router();

router.post("/login", validateUserLogin, loginUser);
router.get("/", getUsers);

module.exports = router;
