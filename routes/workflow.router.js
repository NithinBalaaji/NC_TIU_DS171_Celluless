const router = require('express').Router();

// Importing controllers
const workflowController = require('../controllers/workflow.controller');

// Importing middlewares
const { isLoggedIn } = require('../middlewares/auth');

// GET Routes
router.get('/list', isLoggedIn, workflowController.listWorkflow);
router.get('/create', isLoggedIn, workflowController.renderCreateWorkflow);

// POST Routes
router.post('/create', workflowController.createWorkflow);
router.post('/view', isLoggedIn, workflowController.viewWorkflow);
router.post('/edit', isLoggedIn, workflowController.editWorkflow);

module.exports = router;