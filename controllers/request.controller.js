// Importing config/env variables

// Importing models
const Request = require('../models/request');
const Workflow = require('../models/workflow');
const User = require("../models/user");

//Importing utils
const blockchainUtil = require("../utils/blockchain");

const getNextApprover = async (request) => {
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

exports.listRequest = async (req, res) => {
    try{
        return res.render('listRequest');
        console.log('Request created');
    } catch(error){
        console.log(error.toString());
    }
}

exports.createRequest = async (req, res) => {
    try{
        if(!req.body.workflowId || !req.body.approvers){
            return res.json({success: false})
        }
        let workflowId = req.body.workflowId;
        let workflow = await Workflow.findById(workflowId).populate('approvers.grp').exec();
        if(!workflow){
            console.log('Workflow doesnt exists!');
            return;
        }

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

        let blockchainId = await blockchainUtil.createRequest(user.pubKey, approver[0].approverId, fields);

        let request = new Request({
            blockchainId: blockchainId,
            workflowId: workflow,
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
        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').exec();

        if(!request){
            return res.json({success: false});
        }

        let certificate = await blockchainUtil.getCertificate(request.blockchainId);
        console.log(certificate);


        console.log('View request');
        return res.json({success: true, certificate: certificate});
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

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').exec();

        if(!request){
            return res.json({success: false});
        }

        let nextApprover = await getNextApprover(request);
        await blockchainUtil.approveCertificate(request.blockchainId, nextApprover);
        
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

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').exec();

        if(!request){
            return res.json({success: false});
        }

        await blockchainUtil.rejectCertificate(request.blockchainId);
        
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

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').exec();

        if(!request){
            return res.json({success: false});
        }

        let certificate = await blockchainUtil.getCertificate(request.blockchainId);
        console.log(certificate);

        let ejsPath = request.workflowId.path;
        let compiledEJS = await ejs.compile(fs.readFileSync(ejsPath, 'utf8'),{ async: true });
        let html = await compiledEJS(certificate.fields);
        
        console.log('View certificate request');
        return res.json({success: true, html: html});
    } catch(error){
        console.log(error.toString());
    }
}