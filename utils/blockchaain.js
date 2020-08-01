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

exports.approveRequest = async (requestId, nextApprover) => {
    try {
        let request = Request.findById(requestId).exec();
        request.level++;
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
        console.log(certificate);

        return certificate;
    } catch (err) {
        console.log(err);
    }
};

exports.getPendingApprovals = async () => {
    try {
        // let certificateContract = await getCertificateContract();
        // let pendingApprovals = await certificateContract.methods.getPendingApprovals().send({from: fromAddress});
        // console.log(pendingApprovals);

        return 1;
    } catch (err) {
        console.log(err);
    }
};
