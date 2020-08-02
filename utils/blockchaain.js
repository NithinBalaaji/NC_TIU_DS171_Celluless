const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const {CONTRACT_ADDRESS} = require('../config');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const getCertificateContract = async () => {
    try {
        const response = fs.readFileSync(path.resolve(__dirname,'../build/contracts/CertificateFactory.json'),'utf8');
        let certificateContractAddress = CONTRACT_ADDRESS;
        let certificateContractJSON = JSON.parse(response);
        var contractABI = certificateContractJSON.abi;
        var certificateContract = new web3.eth.Contract(contractABI, certificateContractAddress);
        return certificateContract;
    } catch (error) {
        console.error(error);
    }
}
const Request = require('../models/request');

exports.createRequest = async (fromAddress, nextApprover, fields) => {
    return 1;
};
const {getNextApproverId} = require('../controllers/request.controller');

exports.approveRequest = async (requestId, nextApprover) => {
    try {
        let request = await Request.findById(requestId).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').populate('ownerId').exec();
        request.level++;
        console.log(request.approvers)
        if(request.approvers.length==request.level)
            request.isVerified = true;
        return request.save();
    } catch (err) {
        console.log(err);
    }
};

exports.rejectCertificate = async (id) => {
    try {
        return Request.findByIdAndUpdate(id,{isRejected:true}).exec();
        
    } catch (err) {
        console.log(err);
    }
};

exports.getCertificate = async (blockchainId) => {
    try {
        return "hi";
    } catch (err) {
        console.log(err);
    }
};

exports.getCertificateByQR = async () => {
    try {
        let certificateContract = await getCertificateContract();
        let certificate = await certificateContract.methods.getPendingApprovals().send({from: fromAddress});

        return certificate;
    } catch (err) {
        console.log(err);
    }
};


exports.getPendingApprovals = async (adminUserId) => {
    try {
        let requests = await Request.find({isVerified:false,isRejected:false}).populate('approvers.approverId').populate('approvedBy.approverId').populate('workflowId').populate('ownerId').exec();
        console.log('next pending is : ')
        let result =  [];
        requests.forEach(request=>{
            request.approvers.forEach(approver=>{
                console.log("TCL: exports.getPendingApprovals -> adminUserId", adminUserId)
                console.log("TCL: exports.getPendingApprovals -> approver.approverId._id.toString()", approver.approverId._id.toString())
                if(approver.level===request.level&&approver.approverId._id.toString()==adminUserId)
                    result.push(request);
            })
        })
        return result;
        // return requests.filter(request=>((getNextApproverId(request)[0])===adminUserId));
    } catch (err) {
        console.log(err.toString);
    }
};
