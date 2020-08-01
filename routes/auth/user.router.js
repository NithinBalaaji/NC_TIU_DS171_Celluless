const router = require('express').Router();

// Importing controllers
const userController = require('../../controllers/auth/user.controller');

// Importing middlewares

// Auth routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

module.exports = router;