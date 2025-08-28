const express = require("express");
const { adminSignup, adminLogin } = require("../controllers/adminController");
const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
// router.get("/users", getAllUsers);

module.exports = router;
