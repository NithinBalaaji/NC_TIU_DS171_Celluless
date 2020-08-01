
// Importing config/env variables

// Importing models
const Workflow = require("../models/workflow");
const Group = require("../models/group");
const path = require('path');
const fs = require('fs');

//Importing utils

exports.listWorkflow = async (req, res) => {
    try {
        let workflows = await Workflow.find().populate({
            path: 'approvers.grp',
            populate: {
                path: 'members'
            }
        }).exec();
        // workflows.forEach(async workflow => {
        //     const templateEjs = await fs.readFileSync(path.join('../uploads', workflow.path), 'utf8');
        //     workflow.templateEjs = templateEjs;
        // });
        return res.render('listWorkflow', { workflows });
    } catch (error) {
        console.log(error);
    }
}

exports.renderCreateWorkflow = async (req, res) => {
    try {
        let groups = await Group.find({});
        return res.render('createWorkflow', {groups});
    } catch (error) {
        throw error;
    }
}

exports.createWorkflow = async (req, res) => {
    try {
        console.log("dffdf")
        let workflow = new Workflow();
        workflow.name = req.body.name;
        workflow.fields = req.body.fields;
        approvers = req.body.approvers;
        //workflow.path = req.file.fileName;
        workflow.path = ';;';
        
        for (let i = 0; i < approvers.length; i++) {
            let grp = await Group.findById(approvers[i].grp).exec();
            
            if (!grp) {
                return res.json({ success: false });
            }
            else {
                let approver = {};
                approver.level = approvers[i].level;
                approver.grp = grp;
                approvers.push(approver);
            }
        }
        console.log('helllllllll')
        await workflow.save();
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
}

exports.viewWorkflow = async (req, res) => {
    try {
        let workflow = await Workflow.findById(req.body.workflowId).populate({
            path: 'approvers.grp',
            populate: {
                path: 'members'
            }
        }).exec();
        // const templateEjs = await fs.readFileSync(path.join('../uploads', workflow.path), 'utf8');
        // workflow.templateEjs = templateEjs;
        if (!workflow) {
            return res.json({ success: false });
        }
        else {
            return res.json({ success: true, workflow: workflow });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.editWorkflow = async (req, res) => {
    try {
        let workflow = await Workflow.findById(req.body.workflowId).exec();
        if (!workflow) {
            return res.json({ success: false });
        }
        else {
            workflow.name = req.body.name;
            workflow.fields = req.body.fields;
            approvers = req.body.approvers;

            for (let i = 0; i < approvers.length; i++) {
                let grp = await Group.findById(approvers[i].grp);

                if (!grp) {
                    return res.json({ success: false });
                }
                else {
                    approvers.push(approvers[i]);
                }
            }

            await workflow.save();
            return res.json({ success: true });
        }
    } catch (error) {
        res.json({ success: false });
    }
}
