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


exports.createRequest = async (fromAddress, nextApprover, fields) => {
    try {
        let certificateContract = await getCertificateContract();
        let a = await certificateContract.methods.createCertificate(nextApprover,fields).send({from: fromAddress,gas:200000000});
        let blockchainId = await certificateContract.methods.getLastCertificateIndex().call({from: fromAddress});
        console.log(blockchainId);
        // return 1;
        return blockchainId;
    } catch (err) {
        console.log(err);
        return null;
    }
};

exports.getAccounts = async () =>{
    return web3.eth.getAccounts();
}

exports.approveRequest = async (blockchainId, nextApprover) => {
    try {
        let certificateContract = await getCertificateContract();
        console.log("exports.approveRequest -> fromAddress", fromAddress)
        let response = await certificateContract.methods.approve(blockchainId, nextApprover).send({from: fromAddress});
        
        console.log(response);
        return response;
    } catch (err) {
        console.log(err);
    }
};

exports.rejectRequest = async (blockchainId, nextApprover) => {
    try {
        let certificateContract = await getCertificateContract();
        let response = await certificateContract.methods.reject(blockchainId, nextApprover).send({from: fromAddress});
        
        console.log(response);
        return response;
    } catch (err) {
        console.log(err);
    }
};

exports.getCertificate = async (blockchainId) => {
    try {
        let certificateContract = await getCertificateContract();
        let certificate = await certificateContract.methods.getCertificateById(blockchainId).send({from: fromAddress});
        console.log(certificate);

        return certificate;
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

exports.getPendingApprovals = async (fromAddress) => {
    try {
        let certificateContract = await getCertificateContract();
        let pendingApprovals = await certificateContract.methods.getPendingApprovals().send({from: fromAddress});
        console.log(pendingApprovals);

        return pendingApprovals;
    } catch (err) {
        console.log(err);
    }
};
