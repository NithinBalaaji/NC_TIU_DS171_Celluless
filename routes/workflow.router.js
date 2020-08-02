const router = require('express').Router();
var multer = require('multer')
var upload = multer({ dest: '../uploads/' });
const fs = require("fs")
// Importing controllers
const workflowController = require('../controllers/workflow.controller');

// Importing middlewares
const { isLoggedIn } = require('../middlewares/auth');

// GET Routes
router.get('/list', isLoggedIn, workflowController.listWorkflow);
router.get('/create', isLoggedIn, workflowController.renderCreateWorkflow);

// POST Routes
router.post('/create', isLoggedIn, workflowController.createWorkflow);
router.post('/view', isLoggedIn, workflowController.viewWorkflow);
router.post('/edit', isLoggedIn, workflowController.editWorkflow);

module.exports = router;