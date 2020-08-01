const router = require('express').Router();

// Importing controllers
const requestController = require('../controllers/request.controller');

// Importing middlewares

// Routes
router.post('/create', requestController.createRequest);
router.post('/view', requestController.viewRequest);
router.post('/approve', requestController.approveRequest);
router.post('/reject', requestController.rejectRequest);

router.post('/certificate/view', requestController.viewRequestCertificate);

module.exports = router;