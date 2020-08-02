const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const wkhtmltopdf = require('wkhtmltopdf');
const QRCode = require('qrcode');
const qr = require('qr-image');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Importing config/env variables

const config = require('../config')

// Importing models
const Request = require('../models/request');
const Workflow = require('../models/workflow');
const User = require("../models/user");

//Importing utils
const blockchainUtil = require("../utils/blockchaain");
const emailUtil = require("../utils/mail");

const exportHTML = async (html,pdfOptions) => {
	return new Promise((resolve, reject) => {
		wkhtmltopdf(html, pdfOptions, (error) => {
			if (error) {
                console.error(error);
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

const getNextApproverId = async (request) => {
    // let lvl = 0;
    // console.log(request)
    // for(let i=0; i<request.approvedBy.length; i++){
    //     lvl=Math.max(request.approvedBy[i].level, lvl);
    // }
    let approvers = [];

    for(let i=0; i<request.approvers.length; i++){
        if(request.approvers[i].level==request.level){
            approvers.push(request.approvers[i]);
        }
    }

    let ids = [];
    return approvers.map(approver=>approver.approverId)
    // for(let i=0; i<approvers.length; i++){
    //     let user = await User.findById(approvers[i].approverId).exec();
    //     if(user){
    //         ids.push(user._id);
    //     }
    // }

    // return ids;
}

exports.renderCreateRequest = async (req, res) => {
    try{
        console.log(req.params);
        let workflowId = req.params.workflowId;
        let workflow = await Workflow.findById(workflowId).populate({
            path: 'approvers.grp',
            populate: {
                path: 'members'
            }
        }).exec();
        return res.render('createRequest',{workflow});
    } catch(error){
        console.log(error);
    }
}

exports.createRequest = async (req, res) => {
    try{
        console.log("inside", req.body)
        if(!req.body.workflowId || !req.body.approvers || !req.body.approvers){
            // console.log(req.body);
            return res.json({success: false})
        }
        let workflowId = req.body.workflowId;
        let workflow = await Workflow.findById(workflowId).populate('approvers.grp').exec();
        if(!workflow){
            console.log('Workflow doesnt exists!');
            return;
        }

        let approvers = [];
        let user;
        for (let i = 0; i < req.body.approvers.length; i++) {
            let approver = req.body.approvers[i];
            user = await User.findById(approver.approverId);
            if(!user){
                console.log('User doesnt exists!');
                return;
            }
            approvers.push({
                approverId: user,
                level: approver.level
            });
        }


        let blockchainId = await blockchainUtil.createRequest(req.user.pubKey, approvers[0].approverId.pubKey, req.body.fields);

        let request = new Request({
            blockchainId: blockchainId,
            workflowId: workflow,
            approvers: approvers,
            approvedBy: [],
            fields:req.body.fields,
            level:0,
            ownerId:req.user._id,
            verificationKey:"agdsafsfayu"
        });
        let newReq = await request.save();

        console.log('Request created');
        res.json(newReq);
    } catch(error){
        console.log(error);
        res.json({success: false});
    }
}

exports.viewRequest = async (req, res) => {
    try {
        if(!req.query.requestId){
            return res.json({success: false})
        }

        let requestId = req.query.requestId;
        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').populate('ownerId').exec();

        if(!request){
            return res.json({success: false});
        }

        console.log(request);
        let certificate = await blockchainUtil.getCertificate(request.blockchainId);

        // Run python script
        let data = request.fields.join();
        let templateFilePath = path.resolve(__dirname, "../public/uploads/certifTemplates", request.workflowId.templatePath);
        let scriptFilepath = path.join(__dirname,'../scripts/form_script.py');
        let command = `python ${scriptFilepath} --type=generate --filepath=${templateFilePath} --data="${data}"`;

        console.log("exports.viewRequest -> command", command)
        const { stdout, stderr } = await exec(command);
        if(stderr){
            console.error(stderr);
        }

        let response = JSON.parse(stdout);
        console.log(response.filepath);
        let genFilePath = response.filepath.split("/");
        genFilePath = genFilePath[genFilePath.length-1];

        console.log('View request');
        //return res.json({success: true, certificate: request});
        return res.render('status', {request, isAdmin: req.user.isAdmin, genFilePath});
    } catch(error){
        console.log(error);
    }
}

exports.approveRequest = async (req, res) => {
    try{
        if(!req.params.requestId){
            return res.json({success: false})
        }

        let requestId = req.params.requestId;

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').populate('ownerId').exec();

        if(!request){
            return res.json({success: false});
        }

        request.approvedBy.push({approverId:req.user._id,level:request.level});
        
        await request.save();
        await blockchainUtil.approveRequest(requestId);
        let nextApprover = await getNextApproverId(request);
        console.log(request);
        console.log(request);
        console.log('Approve request');

        // Send mails
        // Email to student
        let subject = "Application request approval - Celluless";
        let statusFullURL = `${config.APP_BASE_URL}/request/view?requestId=${requestId}`;
        let html = `<div>
            <div>Hi ${request.ownerId.name},</div>
            <br/>
            <div>Your request has been approved by ${req.user.name}.</div>
            <br/>
            <div>You can view the current status at ${statusFullURL}</div>
            <br/>
            <div>Email info@celluless.org if you have any questions.</div>
        </div>`;
        let emailResponse = await emailUtil.sendEmail(request.ownerId.email, subject, html);
        if(emailResponse.status_code!=200){
            console.log(emailResponse.message);
        }

        // Email to next approver
        let nextApproverUser = await User.findById(nextApprover);
        html = `<div>
            <div>Hi ${nextApproverUser.name},</div>
            <br/>
            <div>An application form requested by ${request.ownerId.name} needs your approval. Please kindly review!</div>
            <br/>
            <div>You can view the status of the application at ${statusFullURL}</div>
            <br/>
        </div>`;
        emailResponse = await emailUtil.sendEmail(nextApproverUser.email, subject, html);
        if(emailResponse.status_code!=200){
            console.log(emailResponse.message);
        }

        return res.redirect('/?action=approved');
    } catch(error){
        console.log(error);
    }
}

exports.rejectRequest = async (req, res) => {
    try{
        if(!req.params.requestId){
            return res.json({success: false})
        }

        let requestId = req.params.requestId;

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').populate('ownerId').exec();

        if(!request){
            return res.json({success: false});
        }

        await blockchainUtil.rejectCertificate(requestId);

        // Email to user
        let subject = "Application request rejected - Celluless";
        let statusFullURL = `${config.APP_BASE_URL}/request/view?requestId=${requestId}`;
        let html = `<div>
            <div>Hi ${request.ownerId.name},</div>
            <br/>
            <div>Your request has been rejected by ${req.user.name}.</div>
            <br/>
            <div>Please contact ${req.user.email} for further queries.</div>
            <br/>
            <div>You can view the status of the application at ${statusFullURL}</div>
            <br/>
            <div>Email info@celluless.org if you have any questions.</div>
        </div>`;
        let emailResponse = await emailUtil.sendEmail(request.ownerId.email, subject, html);
        if(emailResponse.status_code!=200){
            console.log(emailResponse.message);
        }

        console.log('Reject request');
        return res.redirect('/?action=rejected');
    } catch(error){
        console.log(error);
    }
}

exports.remindRequest = async (req, res) => {
    try{
        if(!req.params.requestId){
            return res.json({success: false})
        }

        let requestId = req.params.requestId;

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').populate('ownerId').exec();

        if(!request){
            return res.json({success: false});
        }

        // Email to next approver
        let subject = "Application remind request - Celluless";
        let nextApprover = await getNextApproverId(request);
        let statusFullURL = `${config.APP_BASE_URL}/request/view?requestId=${requestId}`;
        let nextApproverUser = await User.findById(nextApprover);
        html = `<div>
            <div>Hi ${nextApproverUser.name},</div>
            <br/>
            <div>An application form requested by ${request.ownerId.name} is due for your approval. Kindly review!</div>
            <br/>
            <div>You can view the status of the application at ${statusFullURL}</div>
            <br/>
        </div>`;
        emailResponse = await emailUtil.sendEmail(nextApproverUser.email, subject, html);
        if(emailResponse.status_code!=200){
            console.log(emailResponse.message);
        }

        return res.redirect('/?action=reminded');
    } catch(error){
        console.log(error);
    }
}

exports.viewRequestCertificate = async (req, res) => {
    try {
        if(!req.body.requestId && !req.query.requestId){
            return res.json({success: false})
        }

        let requestId;
        if(req.body.requestId){
            requestId = req.body.requestId;
        } else if(req.query.requestId){
            requestId = req.query.requestId;
        }

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').exec();

        if(!request){
            return res.json({success: false});
        }

        let qrPng = qr.image(`${config.APP_BASE_URL}/request/certificate/view?requestId=${requestId}`, { type: 'png' });
        let qrPath = './qr/';
        let qrImageName = qrPath + requestId +'.png';
        qrPng.pipe(fs.createWriteStream(qrImageName));

        let data = request.fields.join();
        let qrFullPath = path.resolve(qrImageName);
        console.log("ABCD", qrFullPath);

        let templateFilePath = path.resolve(__dirname, "../public/uploads/certifTemplates", request.workflowId.templatePath);
        let scriptFilepath = path.join(__dirname,'../scripts/form_script.py');
        let command = `python ${scriptFilepath} --type=generate --filepath=${templateFilePath} --data="${data}" --qr=${qrFullPath}`;

        const { stdout, stderr } = await exec(command);
        if(stderr){
            console.error(stderr);
        }

        let response = JSON.parse(stdout);
        console.log(response);
        let genFilePath = response.filepath;

        console.log('View certificate request');
        return res.sendFile(genFilePath);
    } catch(error){
        console.log(error);
    }
}

exports.getNextApproverId = getNextApproverId;