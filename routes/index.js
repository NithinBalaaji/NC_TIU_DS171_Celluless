const router = require('express').Router();

// Importing middlewares

// Importing routers
const authRouter = require('./auth/index.router');
const workflowRouter = require('./workflow.router');
const requestRouter = require('./request.router');
const {isLoggedIn} = require('../middlewares/auth');

// Defining routes
router.use('/auth', authRouter);
router.use('/workflow', workflowRouter);
router.use('/request', requestRouter);
router.get('/home',isLoggedIn,(req,res) => {res.render("home")})
module.exports = router;
