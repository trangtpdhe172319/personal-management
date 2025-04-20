const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.get("/users", userController.getAllUser)
router.get("/user/:id", userController.getUserById)
module.exports = router;