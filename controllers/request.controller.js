const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const wkhtmltopdf = require('wkhtmltopdf');
const QRCode = require('qrcode');

// Importing config/env variables

// Importing models
const Request = require('../models/request');
const Workflow = require('../models/workflow');
const User = require("../models/user");

//Importing utils
const blockchainUtil = require("../utils/blockchaain");

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
    }
}

exports.viewRequest = async (req, res) => {
    try {
        if(!req.body.requestId){
            return res.json({success: false})
        }

        let requestId = req.body.requestId;
        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').populate('ownerId').exec();

        if(!request){
            return res.json({success: false});
        }

        let certificate = await blockchainUtil.getCertificate(request.blockchainId);


        console.log('View request');
        return res.json({success: true, certificate: request});
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

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').exec();

        if(!request){
            return res.json({success: false});
        }

        let nextApprover = await getNextApproverId(request);
        request.approvedBy.push({approverId:req.user._id,level:request.level});
        await request.save();
        await blockchainUtil.approveRequest(requestId);
        console.log(request);
        console.log(request);
        console.log('Approve request');
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

        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').exec();

        if(!request){
            return res.json({success: false});
        }

        await blockchainUtil.rejectCertificate(requestId);

        console.log('Reject request');
        return res.redirect('/?action=rejected');
    } catch(error){
        console.log(error);
    }
}

exports.viewRequestCertificate = async (req, res) => {
    try{
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

        let qrcode = await QRCode.toDataURL('http://localhost:8080/request/certificate/view?requestId='+requestId);

        //let certificate = await blockchainUtil.getCertificate(request.blockchainId);

        let ejsPath = '../views/template.ejs';
        let compiledEJS = await ejs.compile(fs.readFileSync(path.resolve(__dirname,ejsPath), 'utf8'),{ async: true });
        let html = await compiledEJS({
            time: new Date().toLocaleString(),
            qrcode: qrcode,
            fields: request.fields
        });
        console.log(html);

        let outputPath = path.resolve(__dirname,'../public/hello.pdf');

        let pdfOptions = {
            pageSize: 'A4',
            output: outputPath,
            "margin-top": '20mm',
            "margin-bottom": '20mm',
            "margin-left": '20mm',
            "margin-right": '20mm',
        };

        await exportHTML(html, pdfOptions);

        console.log('View certificate request');
        return res.sendFile(outputPath);
        return res.json({success: true, html: html});
    } catch(error){
        console.log(error);
    }
}

exports.getNextApproverId = getNextApproverId;
