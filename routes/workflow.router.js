const router = require('express').Router();

// Importing controllers
const workflowController = require('../controllers/workflow.controller');

// Importing middlewares

// Auth routes
router.post('/create', workflowController.createWorkflow);
router.post('/view', workflowController.viewWorkflow);
router.post('/edit', workflowController.editWorkflow);

module.exports = router;