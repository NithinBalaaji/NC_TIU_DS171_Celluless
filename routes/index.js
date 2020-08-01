const router = require('express').Router();

// Importing middlewares

// Importing routers
const authRouter = require('./auth/index.router');
const workflowRouter = require('./workflow.router');
const requestRouter = require('./request.router');
const userRouter = require('./user.router');
const {isLoggedIn} = require('../middlewares/auth');

// Defining routes
router.use('/auth', authRouter);
router.use('/workflow', workflowRouter);
router.use('/request', requestRouter);
router.use('/user', userRouter);
router.get('/',(req,res) => {res.redirect("/user/home")});
router.get('/login',(req,res) => {res.redirect("/auth/user/login")});

module.exports = router;
