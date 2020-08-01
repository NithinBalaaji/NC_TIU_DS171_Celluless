const router = require('express').Router();

// Importing routers
const userAuthRouter = require('./user.router');

// Defining routes
router.use('/user', userAuthRouter);

module.exports = router;