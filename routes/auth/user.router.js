const router = require('express').Router();
const passport = require("passport");

// Importing controllers
const userController = require('../../controllers/auth/user.controller');

// Importing middlewares

// Auth routes
// router.get('/register', userController.renderRegisterUser);

router.post('/sendotp', userController.sendOtp);
router.post('/register', userController.registerUser);
router.post('/login', userController.checkOtp ,passport.authenticate("local",
    {
        failureRedirect: "/login"
    }), (req, res) => {
        const redirectTo = req.session.redirectTo || "/";
        req.session.redirectTo = null;
        res.redirect(redirectTo);
    }
);

router.get('/logout', userController.logoutUser);

router.get('/login', userController.renderLoginUser);
router.get('/', userController.renderHome)

module.exports = router;
