const router = require('express').Router();

// Importing controllers
const adminController = require('../../controllers/auth/admin.controller');

// Importing middlewares

// Auth routes
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/logout', adminController.logoutAdmin);

module.exports = router;