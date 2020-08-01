const userRouter = require('express').Router();
let User = require('../models/user');
let Problem = require('../models/problem');
let Project = require('../models/project');
const { isLoggedIn } = require('../middlewares/auth');

userRouter.get('/', isLoggedIn, async (req, res) => {
    let problemCount = Problem.countDocuments().exec();
    let projectCount = Project.countDocuments().exec();
    let completedProblemCount = Problem.countDocuments({allotedTo: {$ne: null }}).exec();
    let userCount = User.countDocuments().exec();
    let fundsTransfered = Project.aggregate([{
        $group: {
            _id: null,
            total: {
                $sum: "$fundRecv"
            }
        }
    }]).exec();
    [problemCount, projectCount, userCount, fundsTransfered, completedProblemCount] = await Promise.all([problemCount, projectCount, userCount, fundsTransfered,completedProblemCount]);

    res.render('home', { problemCount, projectCount, userCount, fundsTransfered: fundsTransfered.length?fundsTransfered[0].total:0, completedProblemCount });
})

module.exports = userRouter;