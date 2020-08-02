const router = require('express').Router();

// Importing controllers
const requestController = require('../controllers/request.controller');

// Importing middlewares
const {isLoggedIn} = require('../middlewares/auth');

// GET Routes
router.get('/create/:workflowId', isLoggedIn, requestController.renderCreateRequest);

// POST Routes
router.post('/create', isLoggedIn, requestController.createRequest);
router.post('/view', isLoggedIn, requestController.viewRequest);
router.get('/approve/:requestId', isLoggedIn, requestController.approveRequest);
router.get('/reject/:requestId', isLoggedIn, requestController.rejectRequest);

router.get('/certificate/view', requestController.viewRequestCertificate);

module.exports = router;