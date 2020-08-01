// Importing config/env variables

// Importing models
const User = require("../models/user");
const Request = require('../models/request');

//Importing utils

getNextApprover = async (request) => {
    let lvl = 0;
    for(let i=0; i<request.approvedBy.length; i++){
        lvl=Math.max(request.approvedBy[i].level, lvl);
    }
    let approvers = [];

    for(let i=0; i<request.approvers.length; i++){
        if(approvers[i].level==lvl+1){
            approvers.push(request.approvers[i]);
        }
    }

    let pubKeys = [];

    for(let i=0; i<approvers.length; i++){
        let user = await User.findById(approvers[i].approverId).exec();
        if(user){
            pubKeys.push(user.pubKey);
        }
    }

    return pubKeys;
}

exports.createRequest = async (req, res) => {
    try{
        if(!req.body.workflowId || !req.body.approvers){
            return res.json({success: false})
        }
        let workflowId = req.body.workflowId;
        let approvers = [];

        req.body.approvers.forEach( async (approver) => {
            let user = await User.findById(approver.approverId);
            if(!user){
                console.log('User doesnt exists!');
                return;
            }
            approvers.push({
                approverId: user,
                level: approver.level
            });
        });

        // TODO: Write web3 call functions
        let blockchainId = 'lalalala';

        let request = new Request({
            blockchainId: blockchainId,
            workflowId: workflowId,
            approvers: approvers,
            approvedBy: []
        });
        await request.save();

        console.log('Request created');
    } catch(error){
        console.log(error.toString());
    }
}

exports.viewRequest = async (req, res) => {
    try {
        if(!req.body.requestId){
            return res.json({success: false})
        }

        let requestId = req.body.requestId;
        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflow_id').exec();

        if(!request){
            return res.json({success: false});
        }

        console.log('View request');
        return res.json({success: true, request: request});
    } catch(error){
        console.log(error.toString());
    }
}

exports.approveRequest = async (req, res) => {
    try{
        if(!req.body.requestId){
            return res.json({success: false})
        }
        
        let requestId = req.body.requestId;

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflow_id').exec();

        if(!request){
            return res.json({success: false});
        }

        // TODO: web3 approve
        
        console.log('Approve request');
        return res.json({success: true });
    } catch(error){
        console.log(error.toString());
    }
}

exports.rejectRequest = async (req, res) => {
    try{
        if(!req.body.requestId){
            return res.json({success: false})
        }
        
        let requestId = req.body.requestId;

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflow_id').exec();

        if(!request){
            return res.json({success: false});
        }

        // TODO: web3 reject request
        
        console.log('Reject request');
        return res.json({success: true });
    } catch(error){
        console.log(error.toString());
    }
}

exports.viewRequestCertificate = async (req, res) => {
    try{
        if(!req.body.requestId){
            return res.json({success: false})
        }
        
        let requestId = req.body.requestId;

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflow_id').exec();

        if(!request){
            return res.json({success: false});
        }

        // TODO: web3 get certificate data, generate pdf and render
        
        console.log('View certificate request');
        return res.json({success: true });
    } catch(error){
        console.log(error.toString());
    }
}