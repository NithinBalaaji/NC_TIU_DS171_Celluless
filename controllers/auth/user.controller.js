
// Importing config/env variables

// Importing models
const Request = require("../../models/request")
//Importing utils


exports.registerUser = async (req, res) => {
    try{
        await User.register(new User({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            idFaculty: req.body.isFaculty,
            isAdmin: req.body.isAdmin,
            pubKey: req.body.pubKey
        }),req.body.password);

        res.json({success: true});
    } catch(error){
        console.log(error.toString());
        res.json({success: false, error})
    }
}

exports.renderLoginUser = async (req, res) => {
    try{
        res.render('login');
    } catch(error){
        console.log(error.toString());
        res.json({success: false, error})
    }
}

exports.logoutUser = async (req, res) => {
    try{
        req.logout();
        res.redirect("/login");
    } catch(error){
        console.log(error.toString());
        res.json({success: false, error})
    }
}

exports.renderHome = async(req, res) => {
    try{
        let user = req.user;

        if(user.isAdmin){
            //TODO get all requests to be approved by admin and return it
            approvalRequests=[]
            console.log(":(")
            return res.json({success: true, approvalRequests})
        }else{
            let requests = await Request.find({ownerId: req.User}).populate("approvers").populate("approvedBy").populate("workflow_id").exec();
            console.log(":)")
            res.render('studentHome', {requests})
        }
    } catch(error){
        console.log("WQ")
        return res.json({success: false});
    }
}

exports.renderApproval = async (req, res) => {
    try{
        res.render('approval');
    } catch(error){
        console.log(error.toString());
        res.json({success: false, error})
    }
}

