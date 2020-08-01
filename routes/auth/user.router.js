const router = require('express').Router();

// Importing controllers
const userController = require('../../controllers/auth/user.controller');

// Importing middlewares

// Auth routes
// router.get('/register', userController.renderRegisterUser);


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

router.get('/login', userController.renderLoginUser);
router.get('/register', userController.renderRegisterUser);
router.get('/logout', userController.renderLogoutUser);

module.exports = router;