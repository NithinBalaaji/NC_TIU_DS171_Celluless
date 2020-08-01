const router = require('express').Router();

// Importing controllers
const requestController = require('../controllers/request.controller');

// Importing middlewares
const {isLoggedIn} = require('../middlewares/auth');

// GET Routes
router.get('/create', isLoggedIn, requestController.renderCreateRequest);

// POST Routes
router.post('/create', isLoggedIn, requestController.createRequest);
router.post('/view', isLoggedIn, requestController.viewRequest);
router.post('/approve', isLoggedIn, requestController.approveRequest);
router.post('/reject', isLoggedIn, requestController.rejectRequest);

router.post('/certificate/view', requestController.viewRequestCertificate);

module.exports = router;