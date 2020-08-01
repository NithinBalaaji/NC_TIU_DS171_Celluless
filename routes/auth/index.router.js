const router = require('express').Router();

// Importing routers
const adminAuthRouter = require('./admin.router');
const userAuthRouter = require('./user.router');

// Defining routes
router.use('/admin', adminAuthRouter);
router.use('/user', userAuthRouter);

module.exports = router;