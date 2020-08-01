const userRouter = require('express').Router();
var User = require('../models/user');
const userController = require('../controllers/user.controller');


const { isLoggedIn } = require('../middlewares/auth');

userRouter.get('/home',isLoggedIn,userController.renderHome);
module.exports = userRouter;