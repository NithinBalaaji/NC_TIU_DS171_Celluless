const router = require('express').Router();
var multer = require('multer')
var upload = multer({ dest: '../uploads/' });

const storage = multer.diskStorage({
    destination: './public/uploads/certifTemplates',
    filename: function(req, file, cb){
        cb(null, Date.now()+ '.' +file.originalname.split('.')[1]);
    }
});
const certifTemplateUpload = multer({
    storage: storage
}).single('certifTemplate');

// Importing controllers
const workflowController = require('../controllers/workflow.controller');

// Importing middlewares
const { isLoggedIn } = require('../middlewares/auth');

// GET Routes
router.get('/list', isLoggedIn, workflowController.listWorkflow);
router.get('/create', isLoggedIn, workflowController.renderCreateWorkflow);

// POST Routes
router.post('/uploadFormImage', upload.single('template') ,isLoggedIn, workflowController.uploadFormImage);
router.post('/create', isLoggedIn, workflowController.createWorkflow);
router.post('/view', isLoggedIn, workflowController.viewWorkflow);
router.post('/edit', isLoggedIn, workflowController.editWorkflow);
router.post('/uploadCertifTemplate', certifTemplateUpload, workflowController.uploadCertifTemplate)

module.exports = router;