
// Importing config/env variables

// Importing models
const Request = require("../../models/request")
const User= require("../../models/user")
//Importing utils
const blockchainUtil = require("../../utils/blockchaain");

exports.registerUser = async (req, res) => {
    try{
        await User.register(new User({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            isFaculty: req.body.isFaculty,
            isAdmin: req.body.isAdmin,
            pubKey: req.body.pubKey
        }),req.body.password);

        res.json({success: true});
    } catch(error){
        console.log(error);
        res.json({success: false, error})
    }
}

exports.renderLoginUser = async (req, res) => {
    try{
        res.render('login');
    } catch(error){
        console.log(error);
        res.json({success: false, error})
    }
}

exports.logoutUser = async (req, res) => {
    try{
        req.logout();
        res.redirect("/");
    } catch(error){
        console.log(error);
        res.json({success: false, error})
    }
}

exports.renderHome = async(req, res) => {
    try{
        let user = req.user;

        if(user.isAdmin){
            //TODO get all requests to be approved by admin and return it
            approvalRequests=await blockchainUtil.getPendingApprovals(req.user._id);
            console.log(approvalRequests);
            return res.render("adminHome",{requests: approvalRequests});
        }else{
            console.log(user);
            let requests = await Request.find({ownerId: user}).populate("approvers.approverId").populate("approvedBy.approverId").populate("workflowId").populate('ownerId').exec();
            let completedRequests=requests.filter(request=>request.isVerified);
            let rejectedRequests=requests.filter(request=>request.isRejected);
            let activeRequests=requests.filter(request=>(!(request.isVerified||request.isRejected)));
            console.log(completedRequests);
            res.render('studentHome', {data:{activeRequests,completedRequests, rejectedRequests}})
        }
    } catch(error){
        console.log(error);
        return res.json({success: false});
    }
}

exports.renderApproval = async (req, res) => {
    try{
        res.render('approval');
    } catch(error){
        console.log(error);
        res.json({success: false, error})
    }
}
