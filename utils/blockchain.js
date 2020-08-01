const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const getCertificateContract = async () => {
    try {
        const response = await fs.readFileSync('../build/contracts/CertificateFactory.json','utf8');
        let certificateContractAddress = '0xFD9aFBe646e6173360067fa32F485b1693fc9345';
        let certificateContractJSON = response.data;
        var contractABI = certificateContractJSON.abi;
        var certificateContract = new web3.eth.Contract(contractABI, certificateContractAddress);

        return certificateContract;
    } catch (error) {
        console.error(error);
    }
}

const createRequest = async (fromAddress, nextApprover, fields) => {
    try {
        let certificateContract = await getCertificateContract();
        let blockchainId = await certificateContract.methods.createCertificate(nextApprover,fields).send({from: fromAddress});
        
        console.log(blockchainId);
        return blockchainId;
    } catch (err) {
        console.log(err.toString());
    }
};

const approveRequest = async (blockchainId, nextApprover) => {
    try {
        let certificateContract = await getCertificateContract();
        let response = await certificateContract.methods.approve(blockchainId, nextApprover).send({from: fromAddress});
        
        console.log(response);
        return response;
    } catch (err) {
        console.log(err.toString());
    }
};

const rejectRequest = async (blockchainId, nextApprover) => {
    try {
        let certificateContract = await getCertificateContract();
        let response = await certificateContract.methods.reject(blockchainId, nextApprover).send({from: fromAddress});
        
        console.log(response);
        return response;
    } catch (err) {
        console.log(err.toString());
    }
};

const getCertificate = async (blockchainId) => {
    try {
        let certificateContract = await getCertificateContract();
        let certificate = await certificateContract.methods.getCertificateById(blockchainId).send({from: fromAddress});
        console.log(certificate);

        return certificate;
    } catch (err) {
        console.log(err.toString());
    }
};

const getCertificateByQR = async () => {
    try {
        let certificateContract = await getCertificateContract();
        let certificate = await certificateContract.methods.getPendingApprovals().send({from: fromAddress});
        console.log(certificate);

        return certificate;
    } catch (err) {
        console.log(err.toString());
    }
};

const getPendingApprovals = async () => {
    try {
        let certificateContract = await getCertificateContract();
        let pendingApprovals = await certificateContract.methods.getPendingApprovals().send({from: fromAddress});
        console.log(pendingApprovals);

        return pendingApprovals;
    } catch (err) {
        console.log(err.toString());
    }
};

export { 
    createRequest,
    approveRequest,
    rejectRequest,
    getCertificate,
    getCertificateByQR,
    getPendingApprovals
};