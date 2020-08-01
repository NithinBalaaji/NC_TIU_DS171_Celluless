const fs = require('fs');
const Web3 = require('web3');
const {CONTRACT_ADDRESS} = require('../config');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const getCertificateContract = async () => {
    try {
        const response = await fs.readFileSync('../build/contracts/CertificateFactory.json','utf8');
        let certificateContractAddress = CONTRACT_ADDRESS;
        let certificateContractJSON = response.data;
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
        let blockchainId = await certificateContract.methods.createCertificate(nextApprover,fields).send({from: fromAddress});
        
        console.log(blockchainId);
        return blockchainId;
    } catch (err) {
        console.log(err.toString());
    }
};

exports.approveRequest = async (blockchainId, nextApprover) => {
    try {
        let certificateContract = await getCertificateContract();
        let response = await certificateContract.methods.approve(blockchainId, nextApprover).send({from: fromAddress});
        
        console.log(response);
        return response;
    } catch (err) {
        console.log(err.toString());
    }
};

exports.rejectRequest = async (blockchainId, nextApprover) => {
    try {
        let certificateContract = await getCertificateContract();
        let response = await certificateContract.methods.reject(blockchainId, nextApprover).send({from: fromAddress});
        
        console.log(response);
        return response;
    } catch (err) {
        console.log(err.toString());
    }
};

exports.getCertificate = async (blockchainId) => {
    try {
        let certificateContract = await getCertificateContract();
        let certificate = await certificateContract.methods.getCertificateById(blockchainId).send({from: fromAddress});
        console.log(certificate);

        return certificate;
    } catch (err) {
        console.log(err.toString());
    }
};

exports.getCertificateByQR = async () => {
    try {
        let certificateContract = await getCertificateContract();
        let certificate = await certificateContract.methods.getPendingApprovals().send({from: fromAddress});
        console.log(certificate);

        return certificate;
    } catch (err) {
        console.log(err.toString());
    }
};

exports.getPendingApprovals = async () => {
    try {
        let certificateContract = await getCertificateContract();
        let pendingApprovals = await certificateContract.methods.getPendingApprovals().send({from: fromAddress});
        console.log(pendingApprovals);

        return pendingApprovals;
    } catch (err) {
        console.log(err.toString());
    }
};
