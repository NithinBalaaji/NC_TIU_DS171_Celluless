
// Importing config/env variables

// Importing models
const User = require("../models/user");
//Importing utils

getNextApprover = (request) => {
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

    } catch(error){
        console.log(error.toString());
    }
}

exports.viewRequest = async (req, res) => {
    try{

    } catch(error){
        console.log(error.toString());
    }
}

exports.approveRequest = async (req, res) => {
    try{

    } catch(error){
        console.log(error.toString());
    }
}

exports.rejectRequest = async (req, res) => {
    try{

    } catch(error){
        console.log(error.toString());
    }
}

exports.viewRequestCertificate = async (req, res) => {
    try{

    } catch(error){
        console.log(error.toString());
    }
}