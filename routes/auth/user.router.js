const router = require('express').Router();
const passport = require("passport");

// Importing controllers
const userController = require('../../controllers/auth/user.controller');

// Importing middlewares

// Auth routes
// router.get('/register', userController.renderRegisterUser);


router.post('/register', userController.registerUser);
router.post('/login',passport.authenticate("local",
                        {
                            successRedirect:"/home",
                            failureRedirect:"/auth/user/login"
                        }),(req,res)=>{}
);

router.post('/logout', userController.logoutUser);

router.get('/login', userController.renderLoginUser);

module.exports = router;
