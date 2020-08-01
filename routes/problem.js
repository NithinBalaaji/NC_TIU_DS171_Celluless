const problemRouter = require('express').Router();
var Problem = require('../models/problem');
var User = require('../models/user');
var mongoose = require('mongoose');
const { isLoggedIn } = require('../middlewares/auth');

problemRouter.post('/create', isLoggedIn, function (req, res) {

    if (
        !req.body.name ||
        !req.body.desc ||
        !req.body.amount
    ) {
        console.log("Request parameters at problem/create not sufficient");
        res.json({ success: false });
    }
    else {
        var problem = new Problem();
        problem.name = req.body.name;
        problem.owner = req.user;
        problem.desc = req.body.desc;
        problem.amount = req.body.amount;
        problem.save(function (err) {
            if(err){
                console.log("Error in saving problem");
                res.json({success: false});
            }
            else{
                res.redirect('/problems');
            }
        })

    }

})

problemRouter.get('/new', async (req, res) => {
    res.render('problems/new-problem');
})

problemRouter.get('/', function (req, res) {
    Problem.find({}).populate('owner').exec(function (err, problems) {
        if (err) {
            res.json({ success: false });
        }
        else {
            let completed=[], uncompleted=[];
            problems.forEach(problem=>{
                if(problem.allotedTo){
                    completed.push(problem);
                }
                else{
                    uncompleted.push(problem);
                }
            });

            res.render('problems/list-problems',{completed, uncompleted});
        }
    })
})

problemRouter.get('/:id', function (req, res) {
    Problem.findById(req.params.id)
            .populate('owner')
            .populate('proposal.owner')
            .populate('allotedTo')
            .exec(function(err, problem){
        if (err || !problem) {
            console.log("Error or Project with the given id does not exists.");
            res.json({ success: false});
        }
        else {
            let flag=true;
            if(req.user._id.toString()==problem.owner._id.toString()) flag=false;
            
            problem.proposal.forEach(proposal => {
                if(proposal.owner._id.toString()==req.user._id.toString()) flag=false;
            });
            res.render('problems/show-problem', { problem: problem, showForm: flag });
        }
    })
})

problemRouter.post('/:id/propose', function (req, res) {
    Problem.findById(req.params.id, function (err, problem) {
        if (err || !problem) {
            console.log("Error or Problem with the given id does not exists.");
            res.json({ success: false });
        }
        else if(problem.allotedTo){
            console.log("Problem already alloted.");
            res.json({success: false});
        }
        else {
            let proposal = new Object();
            proposal.owner=req.user;
            proposal.desc = req.body.desc;
            problem.proposal.push(proposal);
            problem.save(function (err) {
                if (err) {
                    console.log("Error in saving problem");
                    res.json({ success: false });
                }
                else {
                    res.redirect('/problems/'+problem._id);
                }
            })
        }
    })
})

problemRouter.post("/:id/acceptpropose/:userid", function (req, res) {
    Problem.findById(req.params.id, function (err, problem) {
        if (err || !problem) {
            console.log("Error or Problem with the given id does not exists.");
            res.json({ success: false });
        }
        else if (req.user._id.toString() != problem.owner.toString()) {
            console.log("Request not made by owner of the project.");
            res.json({ success: false });
        }
        else {
            User.findById(req.params.userid, function (err, user) {
                if (err || !user) {
                    console.log("Error or User with the given id does not exist.");
                    res.json({ success: false });
                }
                else{
                    let flag=false;
                    problem.proposal=problem.proposal.filter(preq => {
                        flag=(flag||(preq.owner.toString()==req.params.userid));
                        return preq.owner.toString()!=req.params.userid;
                    })
                    if(!flag){
                        console.log("No proposal by passed userid");
                        res.json({success: false});
                    }
                    else{
                        problem.allotedTo=req.params.userid;
                        problem.proposal=[];
                        problem.save(function(err){
                            if(err){
                                console.log("Error in saving updated problem");
                                res.json({success: false});
                            }
                            else {
                                res.redirect('/problems/'+problem._id);
                            }
                        })
                    }
                }
            })
        }
    })
})

problemRouter.get('/:id/manage', async (req, res) => {
    try {
        let problem = await Problem.findById(req.params.id)
            .populate('owner')
            .populate('allotedTo')
            .populate('proposal.owner')
            .exec();
        res.render('problems/manage-problem', { problem });
    } catch (error) {
        res.json({error});
    }
})

module.exports = problemRouter;
