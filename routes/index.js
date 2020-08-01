const indexRouter = require('express').Router();
const authRouter = require("./auth");
const projectRouter = require("./project");
const problemRouter = require("./problem");
const userRouter = require("./users");
const homeRouter = require("./home");

const { isLoggedIn } = require('../middlewares/auth');


indexRouter.use('/', authRouter);
indexRouter.use('/', homeRouter);
indexRouter.use('/projects',isLoggedIn, projectRouter);
indexRouter.use('/problems',isLoggedIn, problemRouter);
indexRouter.use('/users',isLoggedIn, userRouter);

module.exports = indexRouter;
