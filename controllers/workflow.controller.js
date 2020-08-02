// Importing config/env variables

// Importing models
const Workflow = require('../models/workflow');
const Group = require('../models/group');

//Importing utils
const Uploader = require('../utils/upload');

exports.listWorkflow = async (req, res) => {
	try {
		if (req.user.isAdmin) return res.redirect('/auth/user/login');
		let workflows = await Workflow.find()
			.populate({
				path: 'approvers.grp',
				populate: {
					path: 'members'
				}
			})
			.exec();
		// workflows.forEach(async workflow => {
		//     const templateEjs = await fs.readFileSync(path.join('../uploads', workflow.path), 'utf8');
		//     workflow.templateEjs = templateEjs;
		// });
		return res.render('listWorkflow', { workflows });
	} catch (error) {
		console.log(error);
	}
};

exports.uploadFormImage = (req, res) => {
	console.log(req.file);
	console.log(JSON.stringify(req.file));
	res.send('hi');
};

exports.renderCreateWorkflow = async (req, res) => {
	try {
		let groups = await Group.find({});
		return res.render('createWorkflow', {
			groups: groups,
			uploadState: 0
		});
	} catch (error) {
		throw error;
	}
};

exports.createWorkflow = async (req, res) => {
	try {
		let workflow = new Workflow();
		workflow.name = req.body.name;
		workflow.fields = req.body.fields;
		let approvers = req.body.approvers;
		//workflow.path = req.file.fileName;
		workflow.path = '';

		for (let i = 0; i < approvers.length; i++) {
			let grp = await Group.findById(approvers[i].grp).exec();
			if (!grp) {
				console.log('Group doesnt exists');
				return res.json({ success: false });
			} else {
				let approver = {};
				approver.level = approvers[i].level;
				approver.grp = grp;
				workflow.approvers.push(approver);
			}
		}
		await workflow.save();
		console.log('Success');
		return res.json({ success: true });
	} catch (error) {
		console.log(error);
		res.json({ success: false });
	}
};

exports.viewWorkflow = async (req, res) => {
	try {
		let workflow = await Workflow.findById(req.body.workflowId)
			.populate({
				path: 'approvers.grp',
				populate: {
					path: 'members'
				}
			})
			.exec();
		// const templateEjs = await fs.readFileSync(path.join('../uploads', workflow.path), 'utf8');
		// workflow.templateEjs = templateEjs;
		if (!workflow) {
			return res.json({ success: false });
		} else {
			return res.json({ success: true, workflow: workflow });
		}
	} catch (error) {
		console.log(error);
	}
};

exports.editWorkflow = async (req, res) => {
	try {
		let workflow = await Workflow.findById(req.body.workflowId).exec();
		if (!workflow) {
			return res.json({ success: false });
		} else {
			workflow.name = req.body.name;
			workflow.fields = req.body.fields;
			approvers = req.body.approvers;

			for (let i = 0; i < approvers.length; i++) {
				let grp = await Group.findById(approvers[i].grp);

				if (!grp) {
					return res.json({ success: false });
				} else {
					approvers.push(approvers[i]);
				}
			}

			await workflow.save();
			return res.json({ success: true });
		}
	} catch (error) {
		res.json({ success: false });
	}
};

exports.uploadCertifTemplate = async (req, res) => {
	try {
		console.log(req.file, __dirname + '/../');

		type = '-t generate';
		python_filepath = __dirname + '/../scripts/form_script.py';
		image_filepath = '-f ' + __dirname + '/../public/uploads/certifTemplate/' + req.file.originalname;
		command = 'python ' + python_filepath + ' -f ' + image_filepath + ' -t ' + type;

		// console.log(command);

		// var childProcess = require('child_process');

		// var commitMessage = (function() {
		// 	var spawn = childProcess.spawnSync('python', [ python_filepath, type, image_filepath]);
		// 	var errorText = spawn.stderr.toString().trim();

		// 	if (errorText) {
		// 		console.log('Fatal error from `' + command + '`');
		// 		throw new Error(errorText);
		// 	} else {
		// 		return spawn.stdout.toString().trim();
		// 	}
        // })();
        
        console.log(commitMessage)

		let groups = await Group.find({});
		res.render('createWorkflow', {
			groups: groups,
			uploadState: 1,
			filepath: '/generated_files/' + req.file.originalname,
			blanks: 1
		});
	} catch (error) {
		res.render('createWorkflow', {
			msg: error
		});
	}
};
