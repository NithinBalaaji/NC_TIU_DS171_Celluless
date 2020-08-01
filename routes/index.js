const router = require('express').Router();
const User = require('../models/user')

// Importing middlewares

// Importing routers
const authRouter = require('./auth/index.router');
const workflowRouter = require('./workflow.router');
const requestRouter = require('./request.router');
const userRouter = require('./user.router');
const {isLoggedIn} = require('../middlewares/auth');

// Defining routes
router.use('/auth', authRouter);
router.use('/workflow', workflowRouter);
router.use('/request', requestRouter);
router.use('/user', userRouter);
router.get('/',(req,res) => {res.redirect("/user/home")});
router.get('/login',(req,res) => {res.redirect("/auth/user/login")});



router.get('/setPublicKey/:userId/:pubKey', async (req, res) => {
    
    try{
        let userId = req.params.userId;
        let pubKey = req.params.pubKey;

        let user = await User.findById(userId);
        if(user){
            user.pubKey= pubKey;
            await user.save();
        }
        return res.json({success: false});
    }catch(err){
        console.log(err);
        return res.json({success: true});
    }

    
})

module.exports = router;
