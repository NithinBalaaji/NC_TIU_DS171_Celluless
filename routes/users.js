const userRouter = require('express').Router();
var User = require('../models/user');

const { isLoggedIn } = require('../middlewares/auth');

module.exports = userRouter;